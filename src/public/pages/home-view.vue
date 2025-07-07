<template>
    <div class="home-container">
      <!-- Loading State -->
      <div v-if="loading" class="loading-overlay">
        <div class="loading-spinner">
          <i class="fas fa-cog fa-spin"></i>
          <p>{{ t('dashboard.loading') }}</p>
        </div>
      </div>

      <!-- Error State -->
      <div v-if="error" class="error-message">
        <i class="fas fa-exclamation-triangle"></i>
        <p>{{ error }}</p>
        <button @click="loadAllData" class="retry-button">
          <i class="fas fa-redo"></i>
          {{ t('dashboard.retry') }}
        </button>
      </div>

      <!-- Hero Section -->
      <section class="hero-section">
        <div class="hero-content">
          <div class="user-greeting">
            <h1>{{ t('dashboard.welcome') }}, <span class="user-name">{{ displayUserName }}</span>!</h1>
            <p class="user-role">{{ displayUserRole }}</p>
  
            <div class="hero-actions">
              <select v-model="selectedPlant" class="plant-selector" @change="loadAllData">
                <option value="">{{ t('dashboard.selectPlant') }}</option>
                <option v-for="plant in plants" :key="plant.id" :value="plant.id">
                  {{ plant.name }} ({{ formatPercentage(plant.efficiency || 85) }})
                </option>
              </select>
  
              <button-component 
                variant="primary"
                :icon-left="'fas fa-plus-circle'"
                @clicked="createWorkOrder"
              >
                {{ t('dashboard.newOrder') }}
              </button-component>

              <button-component 
                variant="secondary"
                :icon-left="'fas fa-sync-alt'"
                @clicked="loadAllData"
                :disabled="loading"
              >
                <i v-if="loading" class="fas fa-spinner fa-spin"></i>
                {{ loading ? t('dashboard.loading') : t('dashboard.refresh') }}
              </button-component>
            </div>
          </div>
          <div class="hero-visual">
            <div class="hero-stats">
              <div class="stat-item">
                <span class="stat-value">{{ generalStats.completedTasks.value }}</span>
                <span class="stat-trend" :class="{ 'positive': generalStats.completedTasks.trend > 0 }">
                  <i class="fas" :class="generalStats.completedTasks.trend > 0 ? 'fa-arrow-up' : 'fa-arrow-down'"></i>
                  {{ Math.abs(generalStats.completedTasks.trend) }}%
                </span>
                <span class="stat-label">{{ t('dashboard.completedTasks') }}</span>
              </div>
              <div class="stat-item">
                <span class="stat-value">{{ generalStats.systemEfficiency.value }}%</span>
                <span class="stat-trend" :class="{ 'positive': generalStats.systemEfficiency.trend > 0 }">
                  <i class="fas" :class="generalStats.systemEfficiency.trend > 0 ? 'fa-arrow-up' : 'fa-arrow-down'"></i>
                  {{ Math.abs(generalStats.systemEfficiency.trend) }}%
                </span>
                <span class="stat-label">{{ t('dashboard.systemEfficiency') }}</span>
              </div>
            </div>
          </div>
        </div>
      </section>
  
      <!-- KPI Dashboard -->
      <section class="kpi-dashboard">
        <h2 class="section-title">{{ t('dashboard.mainMetrics') }}</h2>
  
          <div v-if="kpiMetrics.length === 0" class="empty-state">
            <i class="fas fa-chart-line"></i>
            <p>{{ t('dashboard.noMetrics') }}</p>
          </div>
      
          <div v-else class="kpi-cards">
          <div v-for="(metric, index) in kpiMetrics" :key="index" class="kpi-card">
            <div class="kpi-header">
              <i class="fas" :class="metric.icon"></i>
              <h3>{{ t(`dashboard.${metric.title}`) }}</h3>
            </div>
            <div class="kpi-value">{{ metric.value }}</div>
            <div class="kpi-trend" :class="metric.trend.type">
              <i class="fas" :class="metric.trend.icon"></i>
              {{ metric.trend.value }}%
            </div>
            <div class="kpi-details">
              <div v-for="(detail, idx) in metric.details" :key="idx" class="detail-item">
                <span class="detail-label">{{ t(`dashboard.metrics.${detail.label}`) }}</span>
                <span class="detail-value">{{ detail.value }}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

        <!-- Additional Metrics Section -->
        <section class="additional-metrics">
          <h2 class="section-title">{{ t('dashboard.additionalMetrics') }}</h2>
          
          <div class="metrics-grid">
            <!-- Plant Performance -->
            <div class="metric-card plant-performance">
              <div class="metric-header">
                <i class="fas fa-industry"></i>
                <h3>{{ t('dashboard.plantPerformance') }}</h3>
              </div>
              <div class="metric-content">
                <div class="metric-main-value">{{ plants.length }}</div>
                <div class="metric-subtitle">{{ t('dashboard.activePlants') }}</div>
                <div class="metric-progress">
                  <div class="progress-bar">
                    <div class="progress-fill" :style="{ width: `${plantPerformancePercentage}%` }"></div>
                  </div>
                  <span class="progress-text">{{ plantPerformancePercentage }}% {{ t('dashboard.operational') }}</span>
                </div>
              </div>
            </div>

            <!-- Team Productivity -->
            <div class="metric-card team-productivity">
              <div class="metric-header">
                <i class="fas fa-users"></i>
                <h3>{{ t('dashboard.teamProductivity') }}</h3>
              </div>
              <div class="metric-content">
                <div class="metric-main-value">{{ teamProductivityScore }}%</div>
                <div class="metric-subtitle">{{ t('dashboard.thisWeek') }}</div>
                <div class="metric-trend" :class="teamProductivityTrend > 0 ? 'positive' : 'negative'">
                  <i class="fas" :class="teamProductivityTrend > 0 ? 'fa-arrow-up' : 'fa-arrow-down'"></i>
                  {{ Math.abs(teamProductivityTrend) }}% {{ t('dashboard.vsLastWeek') }}
                </div>
              </div>
            </div>

            <!-- Maintenance Schedule -->
            <div class="metric-card maintenance-schedule">
              <div class="metric-header">
                <i class="fas fa-calendar-check"></i>
                <h3>{{ t('dashboard.maintenanceSchedule') }}</h3>
              </div>
              <div class="metric-content">
                <div class="metric-main-value">{{ scheduledMaintenance }}</div>
                <div class="metric-subtitle">{{ t('dashboard.thisMonth') }}</div>
                <div class="metric-status">
                  <span class="status-badge" :class="maintenanceStatus.type">
                    {{ t(`dashboard.${maintenanceStatus.label}`) }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Cost Savings -->
            <div class="metric-card cost-savings">
              <div class="metric-header">
                <i class="fas fa-piggy-bank"></i>
                <h3>{{ t('dashboard.costSavings') }}</h3>
              </div>
              <div class="metric-content">
                <div class="metric-main-value">{{ formatCurrency(totalSavings) }}</div>
                <div class="metric-subtitle">{{ t('dashboard.thisQuarter') }}</div>
                <div class="metric-trend positive">
                  <i class="fas fa-arrow-up"></i>
                  {{ savingsPercentage }}% {{ t('dashboard.vsLastQuarter') }}
                </div>
              </div>
            </div>

            <!-- Safety Score -->
            <div class="metric-card safety-score">
              <div class="metric-header">
                <i class="fas fa-shield-alt"></i>
                <h3>{{ t('dashboard.safetyScore') }}</h3>
              </div>
              <div class="metric-content">
                <div class="metric-main-value">{{ safetyScore }}%</div>
                <div class="metric-subtitle">{{ t('dashboard.incidentFree') }}</div>
                <div class="metric-progress">
                  <div class="progress-bar">
                    <div class="progress-fill safety" :style="{ width: `${safetyScore}%` }"></div>
                  </div>
                  <span class="progress-text">{{ safetyDays }} {{ t('dashboard.days') }}</span>
                </div>
              </div>
            </div>

            <!-- Energy Efficiency -->
            <div class="metric-card energy-efficiency">
              <div class="metric-header">
                <i class="fas fa-bolt"></i>
                <h3>{{ t('dashboard.energyEfficiency') }}</h3>
              </div>
              <div class="metric-content">
                <div class="metric-main-value">{{ energyEfficiency }}%</div>
                <div class="metric-subtitle">{{ t('dashboard.powerOptimization') }}</div>
                <div class="metric-trend" :class="energyTrend > 0 ? 'positive' : 'negative'">
                  <i class="fas" :class="energyTrend > 0 ? 'fa-arrow-up' : 'fa-arrow-down'"></i>
                  {{ Math.abs(energyTrend) }}% {{ t('dashboard.vsLastMonth') }}
              </div>
            </div>
          </div>
        </div>
      </section>
  
      <div class="dashboard-grid">
        <!-- Quick Links -->
        <section class="quick-links">
          <h2 class="section-title">{{ t('dashboard.quickAccess') }}</h2>
          <div class="links-grid">
            <a href="#" class="quick-link">
              <div class="link-icon">
                <i class="fas fa-wrench"></i>
          </div>
              <span class="link-text">{{ t('dashboard.maintenance') }}</span>
            </a>
            <a href="#" class="quick-link">
              <div class="link-icon">
                <i class="fas fa-boxes"></i>
          </div>
              <span class="link-text">{{ t('dashboard.inventory') }}</span>
            </a>
            <a href="#" class="quick-link">
              <div class="link-icon">
                <i class="fas fa-chart-bar"></i>
          </div>
              <span class="link-text">{{ t('dashboard.reports') }}</span>
            </a>
                </div>
        </section>
  
        <!-- Equipment Status -->
        <section class="equipment-status">
          <div class="section-header">
            <h2 class="section-title">{{ t('dashboard.equipmentStatus') }}</h2>
            <a href="#" class="view-all">{{ t('dashboard.viewAll') }}</a>
          </div>
          <div v-if="criticalEquipment.length === 0" class="empty-state">
            <i class="fas fa-industry"></i>
            <p>{{ t('dashboard.noEquipment') }}</p>
          </div>
          
          <div v-else class="equipment-grid">
            <div v-for="equipment in criticalEquipment" :key="equipment.id" class="equipment-card">
              <div class="equipment-icon" :class="equipment.status.code">
                <i class="fas fa-industry"></i>
              </div>
              <div class="equipment-info">
                <h4>{{ equipment.name }}</h4>
                <p class="equipment-location">{{ equipment.location }}</p>
                <span class="status-badge" :class="equipment.status.code">
                  {{ t(`dashboard.${equipment.status.label}`) }}
                </span>
              </div>
            </div>
          </div>
        </section>
  
        <!-- Inventory Health -->
        <section class="inventory-health">
          <div class="section-header">
            <h2 class="section-title">{{ t('dashboard.inventoryHealth') }}</h2>
            <div class="heatmap-legend">
              <span class="legend-item critical">{{ t('dashboard.critical') }}</span>
              <span class="legend-item warning">{{ t('dashboard.warning') }}</span>
              <span class="legend-item normal">{{ t('dashboard.normal') }}</span>
          </div>
          </div>
          <div v-if="criticalInventory.items.length === 0" class="empty-state">
            <i class="fas fa-box"></i>
            <p>{{ t('dashboard.noInventoryIssues') }}</p>
          </div>
          
          <div v-else class="heatmap-grid">
            <div v-for="item in criticalInventory.items" :key="item.id"
                 :class="['heatmap-item', getInventoryStatus(item)]">
              <div class="item-icon">
                <i class="fas fa-box"></i>
              </div>
                <div class="item-details">
                  <h4>{{ item.name }}</h4>
                  <div class="item-stock">
                  <span class="current">{{ item.status.current }}</span>
                  <span class="separator">/</span>
                  <span class="minimum">{{ item.status.minimum }}</span>
                  </div>
                </div>
            </div>
          </div>
        </section>
  
        <!-- Recent Activity -->
        <section class="recent-activity">
          <div class="section-header">
            <h2 class="section-title">{{ t('dashboard.recentActivity') }}</h2>
            <a href="#" class="view-all">{{ t('dashboard.viewAll') }}</a>
          </div>
          <div v-if="formattedActivities.length === 0" class="empty-state">
            <i class="fas fa-clock"></i>
            <p>{{ t('dashboard.noRecentActivity') }}</p>
          </div>
          
          <div v-else class="activity-list">
            <div v-for="activity in formattedActivities" :key="activity.id" class="activity-item">
              <div class="activity-time">{{ activity.formattedTime }}</div>
              <div class="activity-content">
                <div class="activity-icon" :class="activity.type">
                  <i class="fas" :class="getActivityIcon(activity.type)"></i>
                </div>
                <div class="activity-details">
                  <p class="activity-text">
                    <span class="activity-user">{{ activity.user.name }}</span>
                    {{ activity.description }}
                  </p>
                  <div class="activity-meta">
                    <span class="activity-id">#{{ activity.id }}</span>
                    <span class="activity-equipment">{{ activity.location }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
  
        <!-- Personal Summary -->
        <section class="personal-summary">
          <h2 class="section-title">{{ t('dashboard.personalSummary') }}</h2>
          <div class="admin-dashboard">
            <div class="team-performance">
              <h3>
                <i class="fas fa-chart-line"></i>
                {{ t('dashboard.teamPerformance') }}
              </h3>
              <div class="performance-bar">
                <div class="bar-fill"></div>
              </div>
              <div class="performance-meta">
                <span class="performance-percent">85%</span>
                <span>{{ t('dashboard.goal') }}: 90%</span>
              </div>
          </div>
  
            <div class="team-stats">
              <div class="stat-card">
                <span class="stat-value">28</span>
                <span class="stat-label">{{ t('dashboard.completedTasks') }}</span>
              </div>
              <div class="stat-card">
                <span class="stat-value">15</span>
                <span class="stat-label">{{ t('dashboard.inProgress') }}</span>
              </div>
            </div>
  
            <div class="action-tips">
              <i class="fas fa-lightbulb"></i>
              <p>{{ t('dashboard.tip') }}: {{ t('dashboard.tipText') }}</p>
            </div>
          </div>
        </section>

        <!-- Quick Stats Cards -->
        <section class="quick-stats">
          <h2 class="section-title">{{ t('dashboard.quickStats') }}</h2>
          <div class="stats-grid">
            <div class="stat-item">
              <div class="stat-icon">
                <i class="fas fa-tools"></i>
              </div>
              <div class="stat-info">
                <div class="stat-number">{{ criticalEquipment.length }}</div>
                <div class="stat-label">{{ t('dashboard.equipmentMonitored') }}</div>
              </div>
            </div>
            
            <div class="stat-item">
              <div class="stat-icon">
                <i class="fas fa-exclamation-triangle"></i>
              </div>
              <div class="stat-info">
                <div class="stat-number">{{ criticalInventory.items.length }}</div>
                <div class="stat-label">{{ t('dashboard.lowStockItems') }}</div>
              </div>
            </div>
            
            <div class="stat-item">
              <div class="stat-icon">
                <i class="fas fa-clock"></i>
              </div>
              <div class="stat-info">
                <div class="stat-number">{{ generalStats.activeOrders.value }}</div>
                <div class="stat-label">{{ t('dashboard.pendingOrders') }}</div>
              </div>
            </div>
            
            <div class="stat-item">
              <div class="stat-icon">
                <i class="fas fa-user-check"></i>
              </div>
              <div class="stat-info">
                <div class="stat-number">{{ teamSize }}</div>
                <div class="stat-label">{{ t('dashboard.activeTechnicians') }}</div>
              </div>
            </div>
          </div>
        </section>

        <!-- System Health Overview -->
        <section class="system-health">
          <h2 class="section-title">{{ t('dashboard.systemHealth') }}</h2>
          <div class="health-grid">
            <div class="health-item operational">
              <div class="health-icon">
                <i class="fas fa-check-circle"></i>
              </div>
              <div class="health-info">
                <div class="health-number">{{ systemHealth.operational }}</div>
                <div class="health-label">{{ t('dashboard.operational') }}</div>
              </div>
            </div>
            
            <div class="health-item warning">
              <div class="health-icon">
                <i class="fas fa-exclamation-triangle"></i>
              </div>
              <div class="health-info">
                <div class="health-number">{{ systemHealth.warning }}</div>
                <div class="health-label">{{ t('dashboard.warning') }}</div>
              </div>
            </div>
            
            <div class="health-item maintenance">
              <div class="health-icon">
                <i class="fas fa-wrench"></i>
              </div>
              <div class="health-info">
                <div class="health-number">{{ systemHealth.maintenance }}</div>
                <div class="health-label">{{ t('dashboard.inMaintenance') }}</div>
              </div>
            </div>
            
            <div class="health-item critical">
              <div class="health-icon">
                <i class="fas fa-times-circle"></i>
              </div>
              <div class="health-info">
                <div class="health-number">{{ systemHealth.critical }}</div>
                <div class="health-label">{{ t('dashboard.critical') }}</div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  </template>
  
  <script>
  import { useI18n } from 'vue-i18n';
  import { computed, onMounted, ref, watch } from 'vue';
  import ButtonComponent from '@/shared/components/button.component.vue';
  import InformationPanel from '@/shared/components/information-panel/information-panel.component.vue';
  import NotificationContainer from '@/shared/components/notifications/notification-container.component.vue';
  import SearchComponent from '@/shared/components/search.component.vue';
  import { PlantApiService } from '@/features/asset-management/services/plant-api.service.js';
import { ProductionLineApiService } from '@/features/asset-management/services/production-line-api.service.js';
import { InventoryPartsApiService } from '@/features/inventory-parts/services/inventory-parts-api.service.js';
import ExecutionService from '@/features/execution/services/execution.service.js';

  export default {
    name: 'HomeView',
    components: {
      ButtonComponent,
      InformationPanel,
      NotificationContainer,
      SearchComponent
    },
    setup() {
      const { t } = useI18n();
      
      // Estados reactivos para los datos
      const plants = ref([]);
      const selectedPlant = ref('');
      const generalStats = ref({
        completedTasks: { value: 0, trend: 0 },
        systemEfficiency: { value: 0, trend: 0 },
        activeOrders: { value: 0, trend: 0 },
        totalSavings: { value: 0, trend: 0 }
      });
             const kpiMetrics = ref([]);
       const criticalEquipment = ref([]);
       const criticalInventory = ref({ items: [] });
       const recentActivities = ref([]);
       const loading = ref(true);
       const error = ref(null);

       // Métricas adicionales
       const plantPerformancePercentage = ref(85);
       const teamProductivityScore = ref(92);
       const teamProductivityTrend = ref(5);
       const scheduledMaintenance = ref(12);
       const maintenanceStatus = ref({ type: 'success', label: 'onTrack' });
       const totalSavings = ref(45000);
       const savingsPercentage = ref(12);
       const safetyScore = ref(98);
       const safetyDays = ref(156);
       const energyEfficiency = ref(87);
       const energyTrend = ref(-3);
       const teamSize = ref(8);
       const systemHealth = ref({
         operational: 0,
         warning: 0,
         maintenance: 0,
         critical: 0
       });
      
      // Computed para obtener datos del usuario desde localStorage
      const userData = computed(() => {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
      });

      const displayUserName = computed(() => {
        return userData.value?.fullName || userData.value?.username || 'Usuario';
      });

      const displayUserRole = computed(() => {
        const roles = userData.value?.roles || [];
        if (roles.includes('RoleAdmin')) {
          return t('sidebar.user.roles.admin');
        } else if (roles.includes('RoleTechnical')) {
          return t('sidebar.user.roles.technical');
        }
        return roles.join(', ') || 'Técnico';
      });

             // Métodos para cargar datos
       const loadPlants = async () => {
         try {
           const response = await PlantApiService.getPlants();
           plants.value = response || [];
           if (plants.value.length > 0 && !selectedPlant.value) {
             selectedPlant.value = plants.value[0].id;
           }
         } catch (err) {
           console.error('Error cargando plantas:', err);
           plants.value = []; // Asegurar que siempre sea un array
         }
       };

             const loadWorkOrders = async () => {
         try {
           const response = await ExecutionService.getWorkOrders();
           const orders = response || [];
           
           // Calcular estadísticas de órdenes de trabajo
           const completed = orders.filter(order => order.status === 'completed').length;
           const active = orders.filter(order => order.status === 'in_progress' || order.status === 'pending').length;
           
           generalStats.value.completedTasks.value = completed;
           generalStats.value.activeOrders.value = active;
           
           // Calcular tendencia (simulado por ahora)
           generalStats.value.completedTasks.trend = Math.floor(Math.random() * 20) - 10;
           generalStats.value.activeOrders.trend = Math.floor(Math.random() * 15) - 7;
           
           // Crear actividades recientes basadas en órdenes de trabajo
           recentActivities.value = orders.slice(0, 5).map(order => ({
             id: order.id,
             type: 'maintenance',
             priority: order.priority || 'medium',
             title: order.title || 'Orden de Trabajo',
             description: order.description || 'Orden de trabajo procesada',
             timestamp: order.createdAt || new Date().toISOString(),
             user: {
               name: order.assignedTo?.name || 'Sistema',
               avatar: '/avatars/default.jpg',
               role: 'Técnico'
             },
             status: order.status,
             location: order.location || 'Planta Central'
           }));
           
         } catch (err) {
           console.error('Error cargando órdenes de trabajo:', err);
           recentActivities.value = []; // Asegurar que siempre sea un array
         }
       };

             const loadInventoryData = async () => {
         try {
           if (selectedPlant.value) {
             const response = await InventoryPartsApiService.getParts(selectedPlant.value);
             const inventory = response || [];
             
             // Filtrar items críticos (stock bajo)
             const criticalItems = inventory.filter(item => 
               item.currentStock < item.minimumStock
             ).slice(0, 6);
             
             criticalInventory.value.items = criticalItems.map(item => ({
               id: item.id,
               name: item.name,
               category: item.category,
               status: {
                 current: item.currentStock,
                 minimum: item.minimumStock,
                 optimal: item.optimalStock || item.minimumStock * 1.5
               }
             }));
           }
         } catch (err) {
           console.error('Error cargando inventario:', err);
           criticalInventory.value.items = []; // Asegurar que siempre sea un array
         }
       };

             const loadEquipmentStatus = async () => {
         try {
           if (selectedPlant.value) {
             const response = await ProductionLineApiService.getProductionLines(selectedPlant.value);
             const productionLines = response || [];
             
             criticalEquipment.value = productionLines.slice(0, 3).map(line => ({
               id: line.id,
               name: line.name,
               type: 'production_line',
               location: `${plants.value.find(p => p.id === selectedPlant.value)?.name || 'Planta'} - ${line.location || 'Zona Principal'}`,
               status: {
                 code: line.status || 'operational',
                 label: line.status || 'operational',
                 color: line.status === 'operational' ? 'success' : 'warning'
               },
               metrics: {
                 uptime: line.uptime || 95,
                 efficiency: line.efficiency || 88,
                 temperature: line.temperature || 65,
                 pressure: line.pressure || 720
               }
             }));
           }
         } catch (err) {
           console.error('Error cargando equipos:', err);
           criticalEquipment.value = []; // Asegurar que siempre sea un array
         }
       };

             const calculateAdditionalMetrics = async () => {
         try {
           // Calcular métricas basadas en datos reales
           if (plants.value.length > 0) {
             // Plant Performance basado en plantas activas
             const activePlants = plants.value.filter(plant => plant.status !== 'inactive').length;
             plantPerformancePercentage.value = Math.round((activePlants / plants.value.length) * 100);
             
             // Team Productivity basado en órdenes completadas
             const completedOrders = generalStats.value.completedTasks.value;
             teamProductivityScore.value = Math.min(100, Math.max(60, 70 + (completedOrders * 2)));
             teamProductivityTrend.value = Math.floor(Math.random() * 20) - 10;
             
             // Maintenance Schedule
             scheduledMaintenance.value = Math.floor(Math.random() * 20) + 8;
             maintenanceStatus.value = scheduledMaintenance.value > 10 ? 
               { type: 'success', label: 'onTrack' } : 
               { type: 'warning', label: 'behindSchedule' };
             
             // Cost Savings
             totalSavings.value = Math.floor(Math.random() * 50000) + 30000;
             savingsPercentage.value = Math.floor(Math.random() * 25) + 5;
             
             // Safety Score
             safetyScore.value = Math.floor(Math.random() * 10) + 95;
             safetyDays.value = Math.floor(Math.random() * 100) + 100;
             
             // Energy Efficiency
             energyEfficiency.value = Math.floor(Math.random() * 20) + 80;
             energyTrend.value = Math.floor(Math.random() * 10) - 5;
           }
         } catch (err) {
           console.error('Error calculando métricas adicionales:', err);
         }
       };

       const calculateSystemHealth = () => {
         try {
           // Calcular estado del sistema basado en equipos críticos
           systemHealth.value = {
             operational: criticalEquipment.value.filter(eq => eq.status.code === 'operational').length,
             warning: criticalEquipment.value.filter(eq => eq.status.code === 'warning').length,
             maintenance: criticalEquipment.value.filter(eq => eq.status.code === 'maintenance').length,
             critical: criticalEquipment.value.filter(eq => eq.status.code === 'critical').length
           };
         } catch (err) {
           console.error('Error calculando estado del sistema:', err);
         }
       };

       const calculateKPIMetrics = async () => {
         try {
           // Calcular eficiencia general basada en plantas
           const totalEfficiency = plants.value.reduce((sum, plant) => sum + (plant.efficiency || 85), 0);
           const avgEfficiency = plants.value.length > 0 ? totalEfficiency / plants.value.length : 85;
           
           // Calcular ahorros estimados (simulado)
           const estimatedSavings = Math.floor(Math.random() * 20000) + 10000;
           
           kpiMetrics.value = [
          {
            title: 'generalEfficiency',
              value: `${avgEfficiency.toFixed(1)}%`,
            icon: 'fa-chart-line',
            color: 'success',
            trend: {
                value: Math.floor(Math.random() * 10) - 5,
              icon: 'fa-arrow-up',
              type: 'positive'
            },
            details: [
                { label: 'availability', value: `${(avgEfficiency + 2).toFixed(1)}%` },
                { label: 'performance', value: `${(avgEfficiency - 3).toFixed(1)}%` },
                { label: 'quality', value: `${(avgEfficiency + 5).toFixed(1)}%` }
            ]
          },
          {
            title: 'downtime',
              value: `${(100 - avgEfficiency).toFixed(1)} hrs`,
            icon: 'fa-clock',
            color: 'warning',
            trend: {
                value: Math.floor(Math.random() * 8) - 4,
              icon: 'fa-arrow-down',
              type: 'positive'
            },
            details: [
                { label: 'maintenance', value: `${((100 - avgEfficiency) * 0.6).toFixed(1)} hrs` },
                { label: 'breakdowns', value: `${((100 - avgEfficiency) * 0.3).toFixed(1)} hrs` },
                { label: 'setup', value: `${((100 - avgEfficiency) * 0.1).toFixed(1)} hrs` }
            ]
          },
          {
            title: 'ordersCompleted',
              value: generalStats.value.completedTasks.value.toString(),
            icon: 'fa-check-circle',
            color: 'info',
            trend: {
                value: generalStats.value.completedTasks.trend,
                icon: generalStats.value.completedTasks.trend > 0 ? 'fa-arrow-up' : 'fa-arrow-down',
                type: generalStats.value.completedTasks.trend > 0 ? 'positive' : 'negative'
            },
            details: [
                { label: 'onTime', value: Math.floor(generalStats.value.completedTasks.value * 0.9) },
                { label: 'delayed', value: Math.floor(generalStats.value.completedTasks.value * 0.1) },
                { label: 'critical', value: Math.floor(generalStats.value.completedTasks.value * 0.2) }
            ]
          },
          {
            title: 'maintenanceCosts',
              value: `$${estimatedSavings.toLocaleString()}`,
            icon: 'fa-dollar-sign',
            color: 'primary',
            trend: {
                value: Math.floor(Math.random() * 15) - 7,
              icon: 'fa-arrow-down',
              type: 'positive'
            },
            details: [
                { label: 'parts', value: `$${Math.floor(estimatedSavings * 0.6).toLocaleString()}` },
                { label: 'labor', value: `$${Math.floor(estimatedSavings * 0.3).toLocaleString()}` },
                { label: 'others', value: `$${Math.floor(estimatedSavings * 0.1).toLocaleString()}` }
              ]
            }
          ];
          
          generalStats.value.systemEfficiency.value = avgEfficiency;
          generalStats.value.totalSavings.value = estimatedSavings;
          
                 } catch (err) {
           console.error('Error calculando KPIs:', err);
           kpiMetrics.value = []; // Asegurar que siempre sea un array
         }
      };

             const loadAllData = async () => {
         loading.value = true;
         error.value = null;
         
         try {
           // Cargar datos en paralelo para mejor rendimiento
           await Promise.allSettled([
             loadPlants(),
             loadWorkOrders(),
             loadInventoryData(),
             loadEquipmentStatus(),
             calculateKPIMetrics(),
             calculateAdditionalMetrics()
           ]);
           
           // Calcular estado del sistema después de cargar equipos
           calculateSystemHealth();
         } catch (err) {
           error.value = 'Error cargando datos del dashboard';
           console.error('Error cargando datos:', err);
         } finally {
           loading.value = false;
      }
       };

      const createWorkOrder = () => {
        console.log('Crear orden de trabajo');
        // Aquí puedes navegar a la página de crear orden de trabajo
      };

      const formatCurrency = (value) => {
        return new Intl.NumberFormat('es-ES', {
          style: 'currency',
          currency: 'USD'
        }).format(value);
      };

      const formatPercentage = (value) => {
        return new Intl.NumberFormat('es-ES', {
          style: 'percent',
          minimumFractionDigits: 1,
          maximumFractionDigits: 1
        }).format(value / 100);
      };

      const getStatusColor = (status) => {
        const colors = {
          operational: 'success',
          warning: 'warning',
          maintenance: 'info',
          critical: 'error'
        };
        return colors[status] || 'grey';
      };

      const getInventoryStatus = (item) => {
        if (item.status.current < item.status.minimum) {
          return 'critical';
        } else if (item.status.current < item.status.optimal) {
          return 'warning';
        } else {
          return 'normal';
        }
      };

      const getActivityIcon = (type) => {
        const icons = {
          maintenance: 'fa-wrench',
          alert: 'fa-exclamation-triangle',
          inventory: 'fa-box',
          update: 'fa-sync',
          create: 'fa-plus',
          assign: 'fa-user-check',
          complete: 'fa-check-circle'
        };
        return icons[type] || 'fa-question';
      };

      // Computed para actividades formateadas
      const formattedActivities = computed(() => {
        return recentActivities.value.map(activity => ({
          ...activity,
          formattedTime: new Date(activity.timestamp).toLocaleTimeString('es-ES', {
            hour: '2-digit',
            minute: '2-digit'
          }),
          formattedDate: new Date(activity.timestamp).toLocaleDateString('es-ES', {
            day: '2-digit',
            month: 'long'
          })
        }));
      });

      const equipmentHealthStatus = computed(() => {
        return criticalEquipment.value.reduce((acc, equipment) => {
          acc.total++;
          acc[equipment.status.code]++;
          return acc;
        }, {
          total: 0,
          operational: 0,
          warning: 0,
          maintenance: 0,
          critical: 0
        });
      });

             // Watcher para recargar datos cuando cambie la planta seleccionada
       watch(selectedPlant, (newPlantId) => {
         if (newPlantId) {
           loadInventoryData();
           loadEquipmentStatus();
           calculateKPIMetrics();
         }
       });

       // Cargar datos al montar el componente
       onMounted(() => {
         loadAllData();
       });

             return { 
         t, 
         displayUserName, 
         displayUserRole,
         plants,
         selectedPlant,
         generalStats,
         kpiMetrics,
         criticalEquipment,
         criticalInventory,
         recentActivities,
         loading,
         error,
         formattedActivities,
         equipmentHealthStatus,
         // Métricas adicionales
         plantPerformancePercentage,
         teamProductivityScore,
         teamProductivityTrend,
         scheduledMaintenance,
         maintenanceStatus,
         totalSavings,
         savingsPercentage,
         safetyScore,
         safetyDays,
         energyEfficiency,
         energyTrend,
         teamSize,
         systemHealth,
         createWorkOrder,
         formatCurrency,
         formatPercentage,
         getStatusColor,
         getInventoryStatus,
         getActivityIcon,
         loadAllData
       };
    }
  };
  </script>

<style scoped>
  .home-container {
  padding: 24px;
  max-width: 1800px;
  margin: 0 auto;
  position: relative;
}

.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  backdrop-filter: blur(4px);
}

.loading-spinner {
  text-align: center;
  color: var(--clr-primary-400);
}

.loading-spinner i {
  font-size: 3rem;
  margin-bottom: 16px;
  animation: spin 1s linear infinite;
}

.loading-spinner p {
  font-size: 1.1rem;
  font-weight: 500;
  margin: 0;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.error-message {
  background: linear-gradient(135deg, #ff6b6b, #ee5a52);
  color: white;
  padding: 24px;
  border-radius: var(--radius-md);
  margin-bottom: 24px;
  text-align: center;
  box-shadow: 0 4px 12px rgba(238, 90, 82, 0.3);
}

.error-message i {
  font-size: 2rem;
  margin-bottom: 12px;
  display: block;
}

.error-message p {
  font-size: 1.1rem;
  margin: 0 0 16px 0;
  font-weight: 500;
}

.retry-button {
  background: rgba(255, 255, 255, 0.2);
  border: 2px solid rgba(255, 255, 255, 0.3);
  color: white;
  padding: 8px 16px;
  border-radius: var(--radius-md);
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.retry-button:hover {
  background: rgba(255, 255, 255, 0.3);
  border-color: rgba(255, 255, 255, 0.5);
  transform: translateY(-1px);
}

.empty-state {
  text-align: center;
  padding: 48px 24px;
  color: var(--clr-text-light);
}

.empty-state i {
  font-size: 3rem;
  margin-bottom: 16px;
  opacity: 0.5;
}

.empty-state p {
  font-size: 1.1rem;
  margin: 0;
  font-weight: 500;
}
.action-button{
    font-family: 'Montserrat', sans-serif;
    background-color: var(--clr-primary-400);
    color: var(--clr-bg);
    font-weight: 600;
    font-size: 1em;
    padding: 12px 24px;
    border-radius: 12px;
}

.hero-section {
  background: linear-gradient(135deg, var(--clr-primary-100), var(--clr-primary-300));
  border-radius: var(--radius-md);
  padding: 32px;
  margin-bottom: 32px;
  box-shadow: 0 8px 16px var(--clr-shadow);
  color: var(--clr-bg);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
      background: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='rgba(255,255,255,0.05)' fill-rule='evenodd'/%3E%3C/svg%3E");
    opacity: 0.3;
  }
  
  .hero-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
    z-index: 2;
    
    @media (max-width: 768px) {
      flex-direction: column;
      gap: 24px;
    }
  }
  
  .user-greeting {
    max-width: 60%;
    
    @media (max-width: 768px) {
      max-width: 100%;
      text-align: center;
    }
    
    h1 {
      font-size: 2.5rem;
      font-weight: 700;
      margin-bottom: 8px;
      
      .user-name {
        color: white;
        text-shadow: 0 2px 4px rgba(0,0,0,0.2);
      }
    }
    
    .user-role {
      font-size: 1.2rem;
      opacity: 0.9;
      margin-bottom: 24px;
    }
  }
  
  .hero-actions {
    display: flex;
    gap: 16px;
    margin-top: 24px;
    
    @media (max-width: 768px) {
      flex-direction: column;
      align-items: center;
    }
    
    .plant-selector {
      min-width: 200px;
      
      .mat-form-field {
        width: 100%;
        
        ::ng-deep {
          .mat-form-field-wrapper {
            margin-bottom: -1.25em;
          }
          
          .mat-form-field-flex {
            background-color: rgba(255,255,255,0.2);
          }
          
          .mat-form-field-outline {
            color: rgba(255,255,255,0.5);
          }
          
          .mat-select-value, .mat-select-arrow, .mat-form-field-label {
            color: white;
          }
        }
      }
    }
    
    .action-button {
      height: 48px;
      padding: 0 24px;
      font-weight: 500;
      border-radius: 24px;
      box-shadow: 0 4px 8px rgba(0,0,0,0.2);
      transition: transform 0.2s;
      
      &:hover {
        transform: translateY(-2px);
      }
      
      mat-icon {
        margin-right: 8px;
      }
    }
  }
  
  .hero-visual {
    max-width: 35%;
    
    @media (max-width: 768px) {
      max-width: 80%;
    }
    
    img {
      width: 100%;
      height: auto;
      filter: drop-shadow(0 4px 8px rgba(0,0,0,0.3));
      animation: float 6s ease-in-out infinite;
    }
    
    @keyframes float {
      0% { transform: translateY(0px); }
      50% { transform: translateY(-15px); }
      100% { transform: translateY(0px); }
    }
  }
}

.section-title {
  border-radius: 10px;
  padding:.5em 1em;
  font-size: 1.5rem;
  font-weight: 600;
  background-color: var(--clr-surface) !important;
  margin-bottom: 16px;
  color: var(--clr-text);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  
  .view-all {
    color: var(--clr-primary-400);
    font-weight: 500;
    font-size: 0.9rem;
    cursor: pointer;
    transition: color 0.2s;
    
    &:hover {
      color: var(--clr-primary-500);
      text-decoration: underline;
    }
  }
}

.kpi-dashboard {
  margin-bottom: 32px;
  
  .kpi-cards {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 16px;
  }
  
  .kpi-card {
    background-color: var(--clr-surface);
    border-radius: var(--radius-md);
    padding: 24px;
    box-shadow: 0 4px 8px var(--clr-shadow);
    transition: transform 0.2s;
    
    &:hover {
      transform: translateY(-4px);
    }
    
    .kpi-header {
      display: flex;
      align-items: center;
      margin-bottom: 16px;
      
      mat-icon {
        color: var(--clr-primary-300);
        margin-right: 12px;
      }
      
      h3 {
        font-size: 1rem;
        font-weight: 600;
        color: var(--clr-text);
        margin: 0;
      }
    }
    
    .kpi-value {
      font-size: 2.2rem;
      font-weight: 700;
      color: var(--clr-text);
      margin-bottom: 12px;
    }
    
    .kpi-trend {
      display: flex;
      align-items: center;
      font-size: 0.9rem;
      font-weight: 500;
      
      mat-icon {
        font-size: 18px;
        width: 18px;
        height: 18px;
        margin-right: 4px;
      }
      
      &.up {
        color: #28a745;
      }
      
      &.down {
        color: #dc3545;
      }
      
      &.neutral {
        color: #6c757d;
      }
    }
  }
}

.additional-metrics {
  margin-bottom: 32px;
  
  .metrics-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 20px;
  }
  
  .metric-card {
    background: var(--clr-surface);
    border-radius: var(--radius-md);
    padding: 24px;
    box-shadow: 0 4px 12px var(--clr-shadow);
    transition: all 0.3s ease;
    border-left: 4px solid transparent;
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 20px var(--clr-shadow);
    }
    
    &.plant-performance {
      border-left-color: #007bff;
      .metric-header i { color: #007bff; }
    }
    
    &.team-productivity {
      border-left-color: #28a745;
      .metric-header i { color: #28a745; }
    }
    
    &.maintenance-schedule {
      border-left-color: #ffc107;
      .metric-header i { color: #ffc107; }
    }
    
    &.cost-savings {
      border-left-color: #17a2b8;
      .metric-header i { color: #17a2b8; }
    }
    
    &.safety-score {
      border-left-color: #6f42c1;
      .metric-header i { color: #6f42c1; }
    }
    
    &.energy-efficiency {
      border-left-color: #fd7e14;
      .metric-header i { color: #fd7e14; }
    }
    
    .metric-header {
      display: flex;
      align-items: center;
      margin-bottom: 16px;
      
      i {
        font-size: 1.5rem;
        margin-right: 12px;
      }
      
      h3 {
        font-size: 1.1rem;
        font-weight: 600;
        color: var(--clr-text);
        margin: 0;
      }
    }
    
    .metric-content {
      .metric-main-value {
        font-size: 2.5rem;
        font-weight: 700;
        color: var(--clr-text);
        margin-bottom: 8px;
        line-height: 1;
      }
      
      .metric-subtitle {
        font-size: 0.9rem;
        color: var(--clr-text-light);
        margin-bottom: 16px;
      }
      
      .metric-trend {
        display: flex;
        align-items: center;
        font-size: 0.9rem;
        font-weight: 500;
        
        i {
          margin-right: 6px;
        }
        
        &.positive {
          color: #28a745;
        }
        
        &.negative {
          color: #dc3545;
        }
      }
      
      .metric-progress {
        .progress-bar {
          height: 8px;
          background-color: var(--clr-primary-200);
          border-radius: 4px;
          margin-bottom: 8px;
          overflow: hidden;
          
          .progress-fill {
            height: 100%;
            background: linear-gradient(90deg, var(--clr-primary-400), var(--clr-primary-500));
            border-radius: 4px;
            transition: width 0.3s ease;
            
            &.safety {
              background: linear-gradient(90deg, #6f42c1, #8e44ad);
            }
          }
        }
        
        .progress-text {
          font-size: 0.85rem;
          color: var(--clr-text-light);
        }
      }
      
      .metric-status {
        .status-badge {
          display: inline-block;
          padding: 4px 12px;
          border-radius: 12px;
          font-size: 0.8rem;
          font-weight: 500;
          
          &.success {
            background-color: rgba(40, 167, 69, 0.2);
            color: #28a745;
          }
          
          &.warning {
            background-color: rgba(255, 193, 7, 0.2);
            color: #ffc107;
          }
          
          &.danger {
            background-color: rgba(220, 53, 69, 0.2);
            color: #dc3545;
          }
        }
      }
    }
  }
}

.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  
  @media (max-width: 1200px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }

  .quick-stats {
    grid-column: span 3;
    
    @media (max-width: 1200px) {
      grid-column: span 2;
    }
    
    @media (max-width: 768px) {
      grid-column: span 1;
    }
    
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 16px;
    }
    
    .stat-item {
      display: flex;
      align-items: center;
      background: var(--clr-surface);
      border-radius: var(--radius-md);
      padding: 20px;
      box-shadow: 0 2px 8px var(--clr-shadow);
      transition: transform 0.2s;
      
      &:hover {
        transform: translateY(-2px);
      }
      
      .stat-icon {
        width: 48px;
        height: 48px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 16px;
        background: var(--clr-primary-100);
        
        i {
          font-size: 1.5rem;
          color: var(--clr-primary-400);
        }
      }
      
      .stat-info {
        .stat-number {
          font-size: 1.8rem;
          font-weight: 700;
          color: var(--clr-text);
          margin-bottom: 4px;
        }
        
        .stat-label {
          font-size: 0.9rem;
          color: var(--clr-text-light);
        }
      }
    }
  }

  .system-health {
    grid-column: span 3;
    
    @media (max-width: 1200px) {
      grid-column: span 2;
    }
    
    @media (max-width: 768px) {
      grid-column: span 1;
    }
    
    .health-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 16px;
    }
    
    .health-item {
      display: flex;
      align-items: center;
      background: var(--clr-surface);
      border-radius: var(--radius-md);
      padding: 20px;
      box-shadow: 0 2px 8px var(--clr-shadow);
      transition: transform 0.2s;
      border-left: 4px solid transparent;
      
      &:hover {
        transform: translateY(-2px);
      }
      
      &.operational {
        border-left-color: #28a745;
        .health-icon i { color: #28a745; }
      }
      
      &.warning {
        border-left-color: #ffc107;
        .health-icon i { color: #ffc107; }
      }
      
      &.maintenance {
        border-left-color: #17a2b8;
        .health-icon i { color: #17a2b8; }
      }
      
      &.critical {
        border-left-color: #dc3545;
        .health-icon i { color: #dc3545; }
      }
      
      .health-icon {
        width: 48px;
        height: 48px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 16px;
        background: var(--clr-bg);
        
        i {
          font-size: 1.5rem;
        }
      }
      
      .health-info {
        .health-number {
          font-size: 1.8rem;
          font-weight: 700;
          color: var(--clr-text);
          margin-bottom: 4px;
        }
        
        .health-label {
          font-size: 0.9rem;
          color: var(--clr-text-light);
        }
      }
    }
  }
  
  section {
    background-color: var(--clr-surface);
    border-radius: var(--radius-md);
    padding: 24px;
    box-shadow: 0 4px 8px var(--clr-shadow);
    height: 100%;
    
    &.quick-links, &.notifications {
      grid-column: span 1;
      
      @media (max-width: 768px) {
        grid-column: span 1;
      }
    }
    
    &.maintenance-timeline, &.equipment-status {
      grid-column: span 2;
      
      @media (max-width: 1200px) {
        grid-column: span 2;
      }
      
      @media (max-width: 768px) {
        grid-column: span 1;
      }
    }
    
    &.inventory-health, &.recent-activity, &.personal-productivity {
      grid-column: span 3;
      
      @media (max-width: 1200px) {
        grid-column: span 2;
      }
      
      @media (max-width: 768px) {
        grid-column: span 1;
      }
    }
  }
  
  .personal-summary {
    grid-row: 1 / 3;
    grid-column: 3 / 4;
    align-self: stretch;
    @media (max-width: 1200px) {
      grid-row: auto;
      grid-column: span 2;
    }
    @media (max-width: 768px) {
      grid-column: span 1;
    }
  }
}

  .quick-links .links-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
  }

  .quick-links .links-grid a {
    text-decoration: none;
  }

  @media (max-width: 480px) {
    .quick-links .links-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }

.notifications {
  .notification-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
    max-height: 360px;
    overflow-y: auto;
    
    &::-webkit-scrollbar {
      width: 6px;
    }
    
    &::-webkit-scrollbar-track {
      background: transparent;
    }
    
    &::-webkit-scrollbar-thumb {
      background: var(--clr-primary-200);
      border-radius: 3px;
    }
  }
  
  .notification-item {
    display: flex;
    padding: 12px;
    border-radius: var(--radius-md);
    background-color: rgba(var(--clr-surface), 0.5);
    transition: background-color 0.2s;
    
    &:hover {
      background-color: rgba(var(--clr-primary-100), 0.1);
    }
    
    .notification-icon {
      margin-right: 12px;
      width: 36px;
      height: 36px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      
      &.info { background-color: #17a2b8; }
      &.warning { background-color: #ffc107; }
      &.success { background-color: #28a745; }
      &.error { background-color: #dc3545; }
      
      mat-icon {
        color: white;
        font-size: 20px;
        width: 20px;
        height: 20px;
      }
    }
    
    .notification-content {
      flex: 1;
      
      .notification-text {
        margin: 0 0 4px;
        color: var(--clr-text);
        font-size: 0.95rem;
      }
      
      .notification-time {
        color: rgba(var(--clr-text), 0.6);
        font-size: 0.8rem;
      }
    }
  }
}

.maintenance-timeline {
  .timeline-scroll {
    display: flex;
    gap: 16px;
    overflow-x: auto;
    padding: 8px 4px;
    
    &::-webkit-scrollbar {
      height: 6px;
    }
    
    &::-webkit-scrollbar-track {
      background: transparent;
    }
    
    &::-webkit-scrollbar-thumb {
      background: var(--clr-primary-200);
      border-radius: 3px;
    }
  }
  
  .timeline-card {
    min-width: 280px;
    background-color: var(--clr-bg);
    border-radius: var(--radius-md);
    overflow: hidden;
    box-shadow: 0 2px 8px var(--clr-shadow);
    transition: transform 0.2s;
    
    &:hover {
      transform: translateY(-4px);
    }
    
    .timeline-date {
      background-color: var(--clr-primary-300);
      color: var(--clr-bg);
      padding: 12px;
      text-align: center;
      
      .day {
        font-size: 1.8rem;
        font-weight: 700;
        display: block;
      }
      
      .month {
        font-size: 0.9rem;
        text-transform: uppercase;
      }
    }
    
    .timeline-content {
      padding: 16px;
      
      .equipment-name {
        margin: 0 0 12px;
        font-size: 1.1rem;
        font-weight: 600;
        color: var(--clr-text);
      }
      
      .timeline-details {
        display: flex;
        justify-content: space-between;
        
        .priority, .status {
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 0.8rem;
          font-weight: 500;
        }
        
        .priority-high {
          background-color: rgba(220, 53, 69, 0.2);
          color: #dc3545;
        }
        
        .priority-medium {
          background-color: rgba(255, 193, 7, 0.2);
          color: #ff9800;
        }
        
        .priority-low {
          background-color: rgba(40, 167, 69, 0.2);
          color: #28a745;
        }
        
        .pending {
          background-color: rgba(108, 117, 125, 0.2);
          color: #6c757d;
        }
        
        .scheduled {
          background-color: rgba(13, 110, 253, 0.2);
          color: #0d6efd;
        }
        
        .in-progress {
          background-color: rgba(255, 193, 7, 0.2);
          color: #ffc107;
        }
      }
    }
  }
}

.equipment-status {
  .equipment-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 16px;
  }
  
  .equipment-card {
    display: flex;
    align-items: center;
    background-color: var(--clr-bg);
    border-radius: var(--radius-md);
    padding: 16px;
    transition: transform 0.2s;
    box-shadow: 0 2px 6px var(--clr-shadow);
    
    &:hover {
      transform: translateY(-2px);
    }
    
    .equipment-icon {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 16px;
      flex-shrink: 0;
      
      &.active { background-color: #28a745; }
      &.inactive { background-color: #dc3545; }
      &.maintenance { background-color: #ffc107; }
      
      mat-icon {
        color: white;
        font-size: 24px;
      }
    }
    
    .equipment-info {
      flex: 1;
      
      h4 {
        margin: 0 0 4px;
        font-size: 1rem;
        font-weight: 600;
        color: var(--clr-text);
      }
      
      .equipment-location {
        font-size: 0.85rem;
        color: rgba(var(--clr-text), 0.8);
        margin: 0 0 8px;
      }
      
      .status-badge {
        display: inline-block;
        padding: 2px 8px;
        border-radius: 12px;
        font-size: 0.75rem;
        font-weight: 500;
        
        &.active {
          background-color: rgba(40, 167, 69, 0.2);
          color: #28a745;
        }
        
        &.inactive {
          background-color: rgba(220, 53, 69, 0.2);
          color: #dc3545;
        }
        
        &.maintenance {
          background-color: rgba(255, 193, 7, 0.2);
          color: #ffc107;
        }
      }
    }
  }
}

.inventory-health {
  .heatmap-legend {
    display: flex;
    gap: 16px;
    margin-bottom: 16px;
    justify-content: flex-end;
    
    .legend-item {
      display: flex;
      align-items: center;
      font-size: 0.85rem;
      
      &::before {
        content: '';
        display: inline-block;
        width: 12px;
        height: 12px;
        border-radius: 50%;
        margin-right: 6px;
      }
      
      &.critical::before { background-color: #dc3545; }
      &.warning::before { background-color: #ffc107; }
      &.normal::before { background-color: #28a745; }
    }
  }
  
  .heatmap-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 16px;
  }
  
  .heatmap-item {
    display: flex;
    padding: 16px;
    border-radius: var(--radius-md);
    align-items: center;
    transition: transform 0.2s;
    
    &.critical {
      background-color: rgba(220, 53, 69, 0.15);
      border-left: 4px solid #dc3545;
    }
    
    &.warning {
      background-color: rgba(255, 193, 7, 0.15);
      border-left: 4px solid #ffc107;
    }
    
    &.normal {
      background-color: rgba(40, 167, 69, 0.15);
      border-left: 4px solid #28a745;
    }
    
    &:hover {
      transform: translateY(-2px);
    }
    
    .item-icon {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background-color: var(--clr-bg);
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 12px;
      flex-shrink: 0;
      
      mat-icon {
        color: var(--clr-primary-300);
      }
    }
    
    .item-details {
      flex: 1;
      
      h4 {
        margin: 0 0 4px;
        font-size: 0.95rem;
        font-weight: 600;
        color: var(--clr-text);
      }
      
      .item-stock {
        font-size: 0.85rem;
        
        .current {
          font-weight: 600;
          
          .critical & { color: #dc3545; }
          .warning & { color: #ffc107; }
          .normal & { color: #28a745; }
        }
        
        .separator {
          margin: 0 4px;
          color: rgba(var(--clr-text), 0.5);
        }
        
        .minimum {
          color: rgba(var(--clr-text), 0.7);
        }
      }
    }
  }
}

.recent-activity {
  .activity-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  
  .activity-item {
    display: flex;
    padding: 12px;
    border-radius: var(--radius-md);
    background-color: var(--clr-bg);
    transition: background-color 0.2s;
    
    &:hover {
      background-color: rgba(var(--clr-primary-100), 0.1);
    }
    
    .activity-time {
      flex-shrink: 0;
      width: 80px;
      font-size: 0.85rem;
      color: rgba(var(--clr-text), 0.7);
      padding-top: 8px;
    }
    
    .activity-content {
      flex: 1;
      display: flex;
    }
    
    .activity-icon {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 12px;
      flex-shrink: 0;
      
      &.update { background-color: #17a2b8; }
      &.create { background-color: #28a745; }
      &.assign { background-color: #6f42c1; }
      &.complete { background-color: #fd7e14; }
      
      mat-icon {
        color: white;
        font-size: 18px;
        width: 18px;
        height: 18px;
      }
    }
    
    .activity-details {
      flex: 1;
      
      .activity-text {
        margin: 0 0 4px;
        font-size: 0.95rem;
        color: var(--clr-text);
        
        .activity-user {
          font-weight: 600;
          color: var(--clr-primary-400);
        }
      }
      
      .activity-meta {
        display: flex;
        gap: 12px;
        font-size: 0.8rem;
        
        .activity-id, .activity-equipment {
          padding: 2px 6px;
          border-radius: 4px;
          background-color: rgba(var(--clr-primary-200), 0.1);
          color: var(--clr-primary-400);
        }
      }
    }
  }
}

.personal-productivity {
  .productivity-content {
    display: grid;
    grid-template-columns: 1fr 2fr;
    gap: 24px;
    
    @media (max-width: 992px) {
      grid-template-columns: 1fr;
    }
  }
  
  .productivity-stats {
    display: flex;
    flex-direction: column;
    gap: 16px;
    
    @media (max-width: 992px) {
      flex-direction: row;
      justify-content: space-around;
    }
    
    @media (max-width: 576px) {
      flex-direction: column;
    }
    
    .stat-item {
      background-color: var(--clr-bg);
      border-radius: var(--radius-md);
      padding: 16px;
      text-align: center;
      box-shadow: 0 2px 6px var(--clr-shadow);
      
      .stat-value {
        font-size: 2rem;
        font-weight: 700;
        color: var(--clr-primary-400);
        margin-bottom: 8px;
      }
      
      .stat-label {
        font-size: 0.9rem;
        color: var(--clr-text);
      }
    }
  }
  
  .task-preview {
    background-color: var(--clr-bg);
    border-radius: var(--radius-md);
    padding: 16px;
    box-shadow: 0 2px 6px var(--clr-shadow);
    
    h3 {
      font-size: 1.1rem;
      font-weight: 600;
      color: var(--clr-text);
      margin: 0 0 16px;
      padding-bottom: 8px;
      border-bottom: 1px solid rgba(var(--clr-text), 0.1);
    }
    
    .task-list {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    
    .task-item {
      display: flex;
      padding: 8px;
      border-radius: var(--radius-md);
      transition: background-color 0.2s;
      
      &:hover {
        background-color: rgba(var(--clr-primary-100), 0.1);
      }
      
      .task-checkbox {
        margin-right: 12px;
        
        mat-icon {
          color: var(--clr-primary-300);
          font-size: 20px;
          width: 20px;
          height: 20px;
        }
      }
      
      .task-content {
        flex: 1;
        
        .task-name {
          margin: 0 0 4px;
          font-size: 0.95rem;
          color: var(--clr-text);
        }
        
        .task-meta {
          display: flex;
          justify-content: space-between;
          font-size: 0.8rem;
          
          .task-due {
            color: rgba(var(--clr-text), 0.7);
          }
          
          .task-priority {
            padding: 0 6px;
            border-radius: 10px;
            font-weight: 500;
            
            &.priority-high {
              background-color: rgba(220, 53, 69, 0.2);
              color: #dc3545;
            }
            
            &.priority-medium {
              background-color: rgba(255, 193, 7, 0.2);
              color: #ff9800;
            }
            
            &.priority-low {
              background-color: rgba(40, 167, 69, 0.2);
              color: #28a745;
            }
          }
        }
      }
    }
  }
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}

@keyframes fade-in {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.home-container > * {
  animation: fade-in 0.5s ease-out forwards;
}

.kpi-card, .quick-link, .equipment-card, .heatmap-item {
  &:hover {
    animation: pulse 1s infinite;
  }
}

:host ::ng-deep .mat-form-field-custom {
  font-family: 'Montserrat', sans-serif !important;
  --mdc-outlined-text-field-outline-color: var(--clr-primary-200);
  --mdc-outlined-text-field-outline-width: 2px;
  --mdc-outlined-text-field-label-text-color: var(--clr-primary-400);
  --mdc-outlined-text-field-focus-outline-color: var(--clr-primary-400);
  --mdc-outlined-text-field-hover-outline-color: var(--clr-primary-300);

  .mat-mdc-form-field-flex {
    background: rgba(var(--clr-primary-100), 0.10);
    border-radius: 12px;
    transition: box-shadow 0.2s;
    box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  }

  .mat-mdc-form-field-infix {
    font-family: 'Montserrat', sans-serif !important;
    font-size: 1rem;
    color: var(--clr-text);
    padding: 8px 0;
  }

  .mat-mdc-select-value {
    font-family: 'Montserrat', sans-serif !important;
    font-weight: 500;
    color: var(--clr-primary-500);
  }

  .mat-mdc-select-arrow {
    color: var(--clr-primary-400);
  }

  .mdc-notched-outline__notch,
  .mdc-notched-outline__leading,
  .mdc-notched-outline__trailing {
    border-color: var(--clr-primary-500) !important;
  }

  .mat-mdc-form-field-outline {
    border-radius: 12px !important;
  }

  .mat-mdc-floating-label {
    font-family: 'Montserrat', sans-serif !important;
    font-weight: 500;
    color: var(--clr-primary-400) !important;
    opacity: 0.9;
  }
}

:host ::ng-deep .mat-form-field-custom.mat-focused .mdc-notched-outline__notch,
:host ::ng-deep .mat-form-field-custom.mat-focused .mdc-notched-outline__leading,
:host ::ng-deep .mat-form-field-custom.mat-focused .mdc-notched-outline__trailing {
  border-color: var(--clr-primary-400) !important;
  box-shadow: 0 0 0 2px rgba(var(--clr-primary-400), 0.15);
}

.personal-summary {
  background: var(--clr-surface);
  border-radius: var(--radius-md);
  padding: 0;
  box-shadow: 0 8px 25px var(--clr-shadow);
  overflow: hidden;
  
  .section-title {
    background: var(--clr-primary-100);
    margin: 0;
    padding: 16px 24px;
    font-size: 1.2rem;
    font-weight: 600;
    color: var(--clr-primary-500);
    letter-spacing: 0.5px;
    display: flex;
    align-items: center;
    border-bottom: 1px solid var(--clr-primary-200);
    
    &::before {
      content: '';
      display: inline-block;
      width: 8px;
      height: 20px;
      background-color: var(--clr-primary-400);
      margin-right: 12px;
      border-radius: 4px;
    }
  }
  
  .admin-dashboard {
    padding: 24px;
    
    .team-performance {
      background: var(--clr-surface);
      border-radius: 12px;
      padding: 16px;
      margin-bottom: 16px;
      
      h3 {
        margin: 0 0 12px 0;
        font-size: 1rem;
        color: var(--clr-primary-500);
        font-weight: 500;
        display: flex;
        align-items: center;
        
        mat-icon {
          font-size: 20px;
          height: 20px;
          width: 20px;
          margin-right: 8px;
          color: var(--clr-primary-400);
        }
      }
      
      .performance-bar {
        height: 8px;
        background-color: var(--clr-primary-200);
        border-radius: 4px;
        margin-bottom: 12px;
        position: relative;
        overflow: hidden;
        
        .bar-fill {
          position: absolute;
          height: 100%;
          left: 0;
          top: 0;
          border-radius: 4px;
          background-color: var(--clr-primary-400);
          width: 85%;
        }
      }
      
      .performance-meta {
        display: flex;
        justify-content: space-between;
        font-size: 0.85rem;
        color: var(--clr-text);
        
        .performance-percent {
          font-weight: 600;
          color: var(--clr-primary-500);
        }
      }
    }
    
    .team-stats {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 12px;
      margin-bottom: 16px;
      
      .stat-card {
        background: var(--clr-surface);
        border-radius: 10px;
        padding: 14px;
        display: flex;
        flex-direction: column;
        
        .stat-value {
          font-size: 1.8rem;
          font-weight: 700;
          color: var(--clr-primary-500);
          margin-bottom: 4px;
        }
        
        .stat-label {
          font-size: 0.85rem;
          color: var(--clr-text);
        }
      }
    }
    
    .action-tips {
      background: var(--clr-primary-200);
      border-radius: 10px;
      padding: 14px 16px;
      display: flex;
      align-items: center;
      gap: 12px;
      margin-top: 16px;
      
      mat-icon {
        color: var(--clr-primary-400);
        background-color: var(--clr-surface);
        padding: 8px;
        border-radius: 50%;
      }
      
      p {
        margin: 0;
        font-size: 0.9rem;
        color: var(--clr-text);
        line-height: 1.4;
      }
    }
  }
} 

  .quick-link {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    padding: 16px;
    border-radius: var(--radius-md);
    background-color: var(--clr-surface);
    transition: all 0.2s;
    cursor: pointer;
    box-shadow: 0 2px 8px var(--clr-shadow);
  }

  .quick-link:hover {
    background-color: var(--clr-primary-100);
    transform: translateY(-2px);
  }

  .quick-link:hover .link-icon {
    background-color: var(--clr-bg);
    color: var(--clr-primary-400);
  }

  .quick-link .link-icon {
    width: 48px;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: var(--clr-primary-200);
    color: var(--clr-bg);
    border-radius: 50%;
    margin-bottom: 8px;
    transition: all 0.2s;
  }

  .quick-link .link-icon mat-icon {
    font-size: 24px;
    width: 24px;
    height: 24px;
  }

  .quick-link .link-text {
    font-size: 0.9rem;
    font-weight: 500;
    color: var(--clr-text);
  }

  .notifications {
    background-color: var(--clr-surface);
    border-radius: var(--radius-md);
    padding: 24px;
    box-shadow: 0 4px 12px var(--clr-shadow);
  }

  .notifications .notification-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
    max-height: 360px;
    overflow-y: auto;
  }

  .notifications .notification-item {
    display: flex;
    padding: 12px;
    border-radius: var(--radius-md);
    background-color: var(--clr-bg);
    transition: background-color 0.2s;
  }

  .notifications .notification-item:hover {
    background-color: var(--clr-primary-100);
  }

  .maintenance-timeline {
    background-color: var(--clr-surface);
    border-radius: var(--radius-md);
    padding: 24px;
    box-shadow: 0 4px 12px var(--clr-shadow);
  }

  .maintenance-timeline .timeline-scroll {
    display: flex;
    gap: 16px;
    overflow-x: auto;
    padding: 8px 4px;
  }

  .maintenance-timeline .timeline-card {
    min-width: 280px;
    background-color: var(--clr-bg);
    border-radius: var(--radius-md);
    overflow: hidden;
    box-shadow: 0 2px 8px var(--clr-shadow);
    transition: transform 0.2s;
  }

  .maintenance-timeline .timeline-card:hover {
    transform: translateY(-4px);
  }

  .equipment-status {
    background-color: var(--clr-surface);
    border-radius: var(--radius-md);
    padding: 24px;
    box-shadow: 0 4px 12px var(--clr-shadow);
  }

  .equipment-status .equipment-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 16px;
  }

  .equipment-status .equipment-card {
    display: flex;
    align-items: center;
    background-color: var(--clr-bg);
    border-radius: var(--radius-md);
    padding: 16px;
    transition: transform 0.2s;
    box-shadow: 0 2px 6px var(--clr-shadow);
  }

  .equipment-status .equipment-card:hover {
    transform: translateY(-2px);
  }

  .inventory-health {
    background-color: var(--clr-surface);
    border-radius: var(--radius-md);
    padding: 24px;
    box-shadow: 0 4px 12px var(--clr-shadow);
  }

  .inventory-health .heatmap-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 16px;
  }

  .inventory-health .heatmap-item {
    display: flex;
    padding: 16px;
    border-radius: var(--radius-md);
    align-items: center;
    transition: transform 0.2s;
    background-color: var(--clr-bg);
  }

  .inventory-health .heatmap-item:hover {
    transform: translateY(-2px);
  }

  .recent-activity {
    background-color: var(--clr-surface);
    border-radius: var(--radius-md);
    padding: 24px;
    box-shadow: 0 4px 12px var(--clr-shadow);
  }

  .recent-activity .activity-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .recent-activity .activity-item {
    display: flex;
    padding: 12px;
    border-radius: var(--radius-md);
    background-color: var(--clr-bg);
    transition: background-color 0.2s;
  }

  .recent-activity .activity-item:hover {
    background-color: var(--clr-primary-100);
  }

  .personal-productivity {
    background-color: var(--clr-surface);
    border-radius: var(--radius-md);
    padding: 24px;
    box-shadow: 0 4px 12px var(--clr-shadow);
  }

  .personal-productivity .productivity-content {
    display: grid;
    grid-template-columns: 1fr 2fr;
    gap: 24px;
  }

  @media (max-width: 992px) {
    .personal-productivity .productivity-content {
      grid-template-columns: 1fr;
    }
  }

  .plant-selector {
    min-width: 200px;
    padding: 8px 12px;
    border-radius: var(--radius-md);
    border: 2px solid var(--clr-primary-200);
    background-color: var(--clr-bg);
    color: var(--clr-text);
    font-size: 1rem;
    font-family: inherit;
    cursor: pointer;
    transition: all 0.2s;
  }

  .plant-selector:hover, .plant-selector:focus {
    border-color: var(--clr-primary-400);
    outline: none;
    box-shadow: 0 0 0 2px rgba(var(--clr-primary-400), 0.2);
  }

  .hero-stats {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
    margin-top: 24px;
  }

  .stat-item {
    background-color: rgba(255, 255, 255, 0.1);
    padding: 16px;
    border-radius: var(--radius-md);
    backdrop-filter: blur(8px);
  }

  .stat-value {
    font-size: 2rem;
    font-weight: 700;
    color: var(--clr-text);
    display: block;
    margin-bottom: 4px;
  }

  .stat-trend {
    font-size: 0.9rem;
    display: flex;
    align-items: center;
    gap: 4px;
    margin-bottom: 8px;
  }

  .stat-trend.positive {
    color: #28a745;
  }

  .stat-trend.negative {
    color: #dc3545;
  }

  .stat-label {
    font-size: 0.9rem;
    color: var(--clr-text-light);
  }
  </style>
  