<template>
    <div class="home-container">
      <!-- Hero Section -->
      <section class="hero-section">
        <div class="hero-content">
          <div class="user-greeting">
            <h1>{{ t('dashboard.welcome') }}, <span class="user-name">{{ userName }}</span>!</h1>
            <p class="user-role">{{ userRole }}</p>
  
            <div class="hero-actions">
              <select v-model="selectedPlant" class="plant-selector">
                <option value="">{{ t('dashboard.selectPlant') }}</option>
                <option v-for="plant in plants" :key="plant.id" :value="plant.id">
                  {{ plant.name }} ({{ formatPercentage(plant.efficiency) }})
                </option>
              </select>
  
              <button-component 
                variant="primary"
                :icon-left="'fas fa-plus-circle'"
                @clicked="createWorkOrder"
              >
                {{ t('dashboard.newOrder') }}
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
  
        <div class="kpi-cards">
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
          <div class="equipment-grid">
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
          <div class="heatmap-grid">
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
          <div class="activity-list">
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
      </div>
    </div>
  </template>
  
  <script>
  import { useI18n } from 'vue-i18n';
  import ButtonComponent from '@/shared/components/button.component.vue';
  import InformationPanel from '@/shared/components/information-panel/information-panel.component.vue';
  import NotificationContainer from '@/shared/components/notifications/notification-container.component.vue';
  import SearchComponent from '@/shared/components/search.component.vue';

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
      return { t };
    },
    data() {
    return {
        // Datos del usuario y sistema
      userName: 'Usuario',
      userRole: 'Técnico',
        systemHealth: 87,
        selectedPlant: null,
      plants: [
          { id: 1, name: 'Planta Central', status: 'active', efficiency: 92 },
          { id: 2, name: 'Planta Norte', status: 'active', efficiency: 88 },
          { id: 3, name: 'Planta Sur', status: 'maintenance', efficiency: 75 }
        ],

        // Estadísticas generales
        generalStats: {
          completedTasks: {
            value: 28,
            trend: +12,
            period: 'vs semana anterior'
          },
          activeOrders: {
            value: 15,
            trend: -2,
            period: 'vs semana anterior'
          },
          systemEfficiency: {
            value: 92,
            trend: +3,
            period: 'vs mes anterior'
          },
          totalSavings: {
            value: 15600,
            trend: +8,
            period: 'vs mes anterior',
            currency: 'USD'
          }
        },

        // KPIs principales
        kpiMetrics: [
          {
            title: 'generalEfficiency',
            value: '92.5%',
            icon: 'fa-chart-line',
            color: 'success',
            trend: {
              value: +4.2,
              icon: 'fa-arrow-up',
              type: 'positive'
            },
            details: [
              { label: 'availability', value: '94%' },
              { label: 'performance', value: '91%' },
              { label: 'quality', value: '98%' }
            ]
          },
          {
            title: 'downtime',
            value: '1.5 hrs',
            icon: 'fa-clock',
            color: 'warning',
            trend: {
              value: -2.3,
              icon: 'fa-arrow-down',
              type: 'positive'
            },
            details: [
              { label: 'maintenance', value: '0.8 hrs' },
              { label: 'breakdowns', value: '0.4 hrs' },
              { label: 'setup', value: '0.3 hrs' }
            ]
          },
          {
            title: 'ordersCompleted',
            value: '45',
            icon: 'fa-check-circle',
            color: 'info',
            trend: {
              value: +12.3,
              icon: 'fa-arrow-up',
              type: 'positive'
            },
            details: [
              { label: 'onTime', value: '42' },
              { label: 'delayed', value: '3' },
              { label: 'critical', value: '8' }
            ]
          },
          {
            title: 'maintenanceCosts',
            value: '$12,450',
            icon: 'fa-dollar-sign',
            color: 'primary',
            trend: {
              value: -8.4,
              icon: 'fa-arrow-down',
              type: 'positive'
            },
            details: [
              { label: 'parts', value: '$7,250' },
              { label: 'labor', value: '$4,200' },
              { label: 'others', value: '$1,000' }
            ]
          }
        ],

        // Actividades recientes
        recentActivities: [
          {
            id: 1,
            type: 'maintenance',
            priority: 'high',
            title: 'Mantenimiento Preventivo',
            description: 'Completado mantenimiento de Línea de Producción A',
            timestamp: '2024-04-10T10:45:00',
            user: {
              name: 'Juan Pérez',
              avatar: '/avatars/juan.jpg',
              role: 'Técnico Senior'
            },
            status: 'completed',
            location: 'Planta Central - Zona 1',
            details: {
              duration: '2.5 horas',
              parts: ['Filtro hidráulico', 'Sensor de presión'],
              notes: 'Se recomienda seguimiento en 2 semanas'
            }
          },
          {
            id: 2,
            type: 'alert',
            priority: 'critical',
            title: 'Alerta de Sistema',
            description: 'Presión baja detectada en Compresor C-102',
            timestamp: '2024-04-10T10:30:00',
            user: {
              name: 'Sistema',
              avatar: '/avatars/system.jpg',
              role: 'Automatizado'
            },
            status: 'pending',
            location: 'Planta Central - Zona 2',
            details: {
              currentValue: '45 PSI',
              threshold: '60 PSI',
              trend: 'descendente'
            }
          },
          {
            id: 3,
            type: 'inventory',
            priority: 'medium',
            title: 'Actualización de Inventario',
            description: 'Stock bajo de filtros hidráulicos',
            timestamp: '2024-04-10T10:15:00',
            user: {
              name: 'María González',
              avatar: '/avatars/maria.jpg',
              role: 'Supervisor de Inventario'
            },
            status: 'in_progress',
            location: 'Almacén Principal',
            details: {
              currentStock: 5,
              minimumStock: 20,
              orderStatus: 'En proceso'
            }
          }
        ],

        // Estado de equipos críticos
        criticalEquipment: [
          {
            id: 'EQ001',
            name: 'Línea de Producción A',
            type: 'production_line',
            location: 'Planta Central - Zona 1',
            status: {
              code: 'operational',
              label: 'operational',
              color: 'success'
            },
            metrics: {
              uptime: 98.5,
              efficiency: 92.3,
              temperature: 65,
              pressure: 720
            },
            maintenance: {
              last: '2024-03-25',
              next: '2024-04-25',
              type: 'Preventivo'
            },
            alerts: []
          },
          {
            id: 'EQ002',
            name: 'Compresor Industrial C-102',
            type: 'compressor',
            location: 'Planta Central - Zona 2',
            status: {
              code: 'warning',
              label: 'warning',
              color: 'warning'
            },
            metrics: {
              uptime: 85.2,
              efficiency: 78.5,
              temperature: 82,
              pressure: 45
            },
            maintenance: {
              last: '2024-03-15',
              next: '2024-04-15',
              type: 'Correctivo'
            },
            alerts: [
              {
                type: 'warning',
                message: 'Presión por debajo del óptimo',
                timestamp: '2024-04-10T10:30:00'
              }
            ]
          },
          {
            id: 'EQ003',
            name: 'Sistema de Refrigeración',
            type: 'cooling_system',
            location: 'Planta Central - Zona 3',
            status: {
              code: 'maintenance',
              label: 'inMaintenance',
              color: 'info'
            },
            metrics: {
              uptime: 91.8,
              efficiency: 88.4,
              temperature: 18,
              pressure: 350
            },
            maintenance: {
              last: '2024-04-10',
              next: '2024-05-10',
              type: 'Preventivo'
            },
            alerts: []
          }
        ],

        // Inventario crítico
        criticalInventory: {
          summary: {
            total: 1250,
            lowStock: 28,
            outOfStock: 5,
            onOrder: 15
          },
          items: [
            {
              id: 'INV001',
              name: 'Filtros Hidráulicos FH-2000',
              category: 'Filtración',
              code: 'FIL-2000',
              status: {
                current: 5,
                minimum: 20,
                optimal: 30,
                onOrder: 25
              },
              supplier: {
                name: 'HydraFilters Inc.',
                leadTime: '5 días',
                lastOrderDate: '2024-04-05'
              },
              usage: {
                monthly: 15,
                trend: '+5%'
              }
            },
            {
              id: 'INV002',
              name: 'Rodamientos SKF-102',
              category: 'Componentes',
              code: 'ROD-102',
              status: {
                current: 8,
                minimum: 15,
                optimal: 25,
                onOrder: 20
              },
              supplier: {
                name: 'SKF Solutions',
                leadTime: '7 días',
                lastOrderDate: '2024-04-03'
              },
              usage: {
                monthly: 12,
                trend: '-2%'
              }
            },
            {
              id: 'INV003',
              name: 'Aceite Lubricante Industrial',
              category: 'Lubricantes',
              code: 'LUB-450',
              status: {
                current: 12,
                minimum: 50,
                optimal: 75,
                onOrder: 100
              },
              supplier: {
                name: 'LubriTech SA',
                leadTime: '3 días',
                lastOrderDate: '2024-04-08'
              },
              usage: {
                monthly: 45,
                trend: '0%'
              }
            }
          ]
        }
      };
    },

    computed: {
      formattedActivities() {
        return this.recentActivities.map(activity => ({
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
      },

      equipmentHealthStatus() {
        return this.criticalEquipment.reduce((acc, equipment) => {
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
      }
    },

    methods: {
      loadUserFromLocalStorage() {
        const userData = localStorage.getItem('userSession');
        if (userData) {
          const user = JSON.parse(userData);
          this.userName = user.name || 'Usuario';
          this.userRole = user.roles?.includes('ROLE_ADMIN') ? 'Administrador' : 'Técnico';
        }
      },

      createWorkOrder() {
        console.log('Crear orden de trabajo');
      },

      formatCurrency(value) {
        return new Intl.NumberFormat('es-ES', {
          style: 'currency',
          currency: 'USD'
        }).format(value);
      },

      formatPercentage(value) {
        return new Intl.NumberFormat('es-ES', {
          style: 'percent',
          minimumFractionDigits: 1,
          maximumFractionDigits: 1
        }).format(value / 100);
      },

      getStatusColor(status) {
        const colors = {
          operational: 'success',
          warning: 'warning',
          maintenance: 'info',
          critical: 'error'
        };
        return colors[status] || 'grey';
      },

      getInventoryStatus(item) {
        if (item.status.current < item.status.minimum) {
          return 'critical';
        } else if (item.status.current < item.status.optimal) {
          return 'warning';
        } else {
          return 'normal';
        }
      },

      getActivityIcon(type) {
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
      }
    },

    mounted() {
      this.loadUserFromLocalStorage();
    }
  };
  </script>

<style scoped>
  .home-container {
  padding: 24px;
  max-width: 1800px;
  margin: 0 auto;
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
  