import {Component, computed, inject, OnInit, signal} from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxEchartsDirective, provideEchartsCore } from 'ngx-echarts';
import type { EChartsOption } from 'echarts';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import {EndpointDataSet} from '../../../store/common/endpoint/endpoint-data-set';
import {EndpointDataSource} from '../../../store/common/endpoint/endpoint-data-source';
import {UiToastService} from '../../../ui/core/service/ui-toast.service';
import {UserStatisticsDto, UserStatisticsV1RestControllerService} from '../../../openapi/generated/storage';
import {AuthService} from '../../../shared/service/auth.service';
import {toSignal} from '@angular/core/rxjs-interop';

@Component({
    selector: 'app-dashboard-overview',
    imports: [CommonModule, NgxEchartsDirective, TranslatePipe],
    providers: [
        provideEchartsCore({ echarts: () => import('echarts') })
    ],
    templateUrl: './dashboard-overview.component.html',
    styleUrl: './dashboard-overview.component.css'
})
export class DashboardOverviewComponent implements OnInit {
    private readonly authService = inject(AuthService);
    private readonly toastService = inject(UiToastService);
    private readonly userStatisticsService = inject(UserStatisticsV1RestControllerService);
    private readonly translate = inject(TranslateService);

    private readonly langChange = toSignal(this.translate.onLangChange);

    statsEndpointDataSet = new EndpointDataSet(new EndpointDataSource(), this.toastService);
    areUserStatsFetching = computed(() => this.statsEndpointDataSet.getIsFetchingSignal()());

    userStats = signal<UserStatisticsDto | undefined>(undefined);
    refreshRotation = signal(0);

    ngOnInit(): void {
        this.fetchStatistics();
    }

    fetchStatistics() {
        this.refreshRotation.update(r => r + 360);
        const userId = this.authService.getUserId();
        if (!userId) {
            console.error("User id not found in token.");
            return;
        }

        this.statsEndpointDataSet.sendRequest<UserStatisticsDto>(
            () => this.userStatisticsService.getUserStatistics(userId)
        ).subscribe({
            next: (data) => {
                this.userStats.set(data);
            }
        });
    }

    pieChartOptions = computed<EChartsOption>(() => {
        this.langChange();
        const stats = this.userStats();
        return {
            tooltip: {
                trigger: 'item',
                formatter: '{a} <br/>{b}: {c}%'
            },
            legend: {
                bottom: '0%',
                left: 'center',
                textStyle: {
                    color: '#9ca3af'
                }
            },
            series: [
                {
                    name: this.translate.instant('app.dashboard.overview.mediaTypes.title'),
                    type: 'pie',
                    radius: ['40%', '60%'],
                    center: ['50%', '45%'],
                    avoidLabelOverlap: false,
                    itemStyle: {
                        borderRadius: 10,
                        borderWidth: 0
                    },
                    label: {
                        show: false,
                        position: 'center',
                        color: '#6b7280',
                        textBorderWidth: 0,
                        textBorderColor: 'transparent',
                        textShadowColor: 'transparent'
                    },
                    emphasis: {
                        label: {
                            show: true,
                            fontSize: 20,
                            fontWeight: 'bold',
                            color: '#6b7280',
                            textBorderWidth: 0,
                            textBorderColor: 'transparent',
                            textShadowColor: 'transparent'
                        }
                    },
                    labelLine: {
                        show: false
                    },
                    data: [
                        { value: stats?.imagesCount || 0, name: this.translate.instant('app.dashboard.overview.mediaTypes.images') },
                        { value: stats?.videoCount || 0, name: this.translate.instant('app.dashboard.overview.mediaTypes.videos') },
                        { value: stats?.animationCount || 0, name: this.translate.instant('app.dashboard.overview.mediaTypes.animations') },
                        { value: stats?.musicCount || 0, name: this.translate.instant('app.dashboard.overview.mediaTypes.music') }
                    ]
                }
            ]
        };
    });

    lineChartOptions = computed<EChartsOption>(() => {
        this.langChange();
        const chartData = this.userStats()?.last7DaysChart || [];

        const dates = chartData.map(d => d.date ? new Date(d.date).toLocaleDateString(undefined, { weekday: 'short' }) : '');
        const newTags = chartData.map(d => d.newTagsCount || 0);
        const newArtists = chartData.map(d => d.newArtistsCount || 0);
        const newPosts = chartData.map(d => d.newPostsCount || 0);
        const newCollections = chartData.map(d => d.newCollectionsCount || 0);

        return {
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                data: [
                    this.translate.instant('app.dashboard.overview.growthChart.newTags'),
                    this.translate.instant('app.dashboard.overview.growthChart.newArtists'),
                    this.translate.instant('app.dashboard.overview.growthChart.newPosts'),
                    this.translate.instant('app.dashboard.overview.growthChart.newCollections')
                ],
                bottom: '0%',
                textStyle: {
                    color: '#9ca3af'
                }
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '10%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: dates.length ? dates : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                axisLabel: {
                    color: '#9ca3af'
                }
            },
            yAxis: {
                type: 'value',
                axisLabel: {
                    color: '#9ca3af'
                },
                splitLine: {
                    lineStyle: {
                        color: 'rgba(107, 114, 128, 0.2)'
                    }
                }
            },
            series: [
                {
                    name: this.translate.instant('app.dashboard.overview.growthChart.newTags'),
                    type: 'line',
                    smooth: true,
                    data: newTags.length ? newTags : [0, 0, 0, 0, 0, 0, 0]
                },
                {
                    name: this.translate.instant('app.dashboard.overview.growthChart.newArtists'),
                    type: 'line',
                    smooth: true,
                    data: newArtists.length ? newArtists : [0, 0, 0, 0, 0, 0, 0]
                },
                {
                    name: this.translate.instant('app.dashboard.overview.growthChart.newPosts'),
                    type: 'line',
                    smooth: true,
                    data: newPosts.length ? newPosts : [0, 0, 0, 0, 0, 0, 0]
                },
                {
                    name: this.translate.instant('app.dashboard.overview.growthChart.newCollections'),
                    type: 'line',
                    smooth: true,
                    data: newCollections.length ? newCollections : [0, 0, 0, 0, 0, 0, 0]
                }
            ]
        };
    });
}
