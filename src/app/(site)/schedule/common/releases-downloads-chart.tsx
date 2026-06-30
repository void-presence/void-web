'use client'

import styles from '@/release-schedule.module.scss'
import layoutStyles from '@components/panel-layout/layout-panels.module.scss'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

interface ReleasesDownloadsChartProps {
	data: {
		tag: string
		totalDownloads: number
	}[]
	title: string
}

export default function ReleasesDownloadsChart({ data, title }: ReleasesDownloadsChartProps) {
	const chartData = data.map(item => ({
		tag: item.tag,
		downloads: item.totalDownloads,
	}))

	const total = chartData.reduce((sum, item) => sum + item.downloads, 0)

	return (
		<div className={layoutStyles.preview_card} style={{ padding: '20px 20px 20px 0' }}>
			<div className={layoutStyles.preview_header} style={{ padding: '0 0 0 20px' }}>
				<h3 className={styles.preview_title}>{title}</h3>
				<div className={layoutStyles.preview_badge}>
					<span className={layoutStyles.preview_badge_text}>
						{total.toLocaleString('en-US')} total downloads
					</span>
				</div>
			</div>
			<div className={styles.downloads_chart_wrap}>
				<ResponsiveContainer width='100%' height={260}>
					<BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 32 }}>
						<CartesianGrid
							stroke='rgba(148, 163, 184, 0.18)'
							strokeDasharray='3 3'
							vertical={false}
							horizontal={false}
						/>
						<XAxis
							dataKey='tag'
							tickLine={false}
							axisLine={false}
							tickMargin={10}
							tick={{ fontSize: 11, fill: 'rgba(148, 163, 184, 0.9)' }}
							angle={-35}
							textAnchor='end'
							height={52}
						/>
						<YAxis
							tickLine={false}
							axisLine={false}
							tickMargin={8}
							tick={{ fontSize: 11, fill: 'rgba(148, 163, 184, 0.9)' }}
						/>
						<Tooltip
							cursor={{ fill: 'rgba(148, 163, 184, 0.08)' }}
							contentStyle={{
								backgroundColor: '#1a1a1ae6',
								borderRadius: 10,
								border: '1px solid #ffffff10',
								padding: '6px 10px',
							}}
							labelStyle={{
								fontSize: 11,
								color: '#e5e7eb',
								marginBottom: 2,
							}}
							itemStyle={{
								fontSize: 11,
								color: '#e5e7eb',
							}}
							formatter={(value: any) => [Number(value).toLocaleString('en-US'), 'Downloads']}
						/>
						<Bar
							dataKey='downloads'
							radius={[4, 4, 0, 0]}
							fill='rgba(229, 231, 235, 0.85)'
							barSize={18}
						/>
					</BarChart>
				</ResponsiveContainer>
			</div>
		</div>
	)
}
