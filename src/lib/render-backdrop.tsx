'use client'

import { useEffect, useRef } from 'react'

const lerp = (start: number, end: number, t: number) => start * (1 - t) + end * t

export default function RenderBackdropAnimation() {
	const canvasRef = useRef<HTMLCanvasElement>(null)

	useEffect(() => {
		const canvas = canvasRef.current
		if (!canvas) return
		const ctx = canvas.getContext('2d')
		if (!ctx) return

		let width = (canvas.width = window.innerWidth)
		let height = (canvas.height = window.innerHeight)

		const drawBackground = () => {
			const bg = ctx.createRadialGradient(width / 2, height / 2, 0, width / 2, height / 2, width)
			bg.addColorStop(0, '#000000')
			bg.addColorStop(1, '#000000')
			ctx.fillStyle = bg
			ctx.fillRect(0, 0, width, height)
		}

		class Star {
			x = 0
			y = 0
			size = 0
			speed = 0
			opacity = 0
			targetOpacity = 0.8
			constructor() {
				this.reset()
				this.opacity = 0
			}
			reset() {
				this.x = Math.random() * width
				this.y = Math.random() * height
				this.size = Math.random() * 1.5
				this.speed = Math.random() * 0.05 + 0.02
				this.targetOpacity = 0.4 + Math.random() * 0.4
			}
			update(ctx: CanvasRenderingContext2D) {
				this.x -= this.speed
				this.opacity = lerp(this.opacity, this.targetOpacity, 0.02)
				if (this.x < 0) this.reset()

				ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`
				ctx.beginPath()
				ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
				ctx.fill()
			}
		}

		class ShootingStar {
			x = 0
			y = 0
			len = 0
			speed = 0
			active = false
			timer = 0
			constructor() {
				this.reset()
			}
			reset() {
				this.x = width + 100
				this.y = Math.random() * height * 0.5
				this.len = Math.random() * 150 + 50
				this.speed = Math.random() * 8 + 4
				this.active = false
				this.timer = Date.now() + Math.random() * 5000
			}
			update(ctx: CanvasRenderingContext2D) {
				if (!this.active && Date.now() > this.timer) this.active = true
				if (this.active) {
					this.x -= this.speed
					this.y += this.speed * 0.5
					const grad = ctx.createLinearGradient(
						this.x,
						this.y,
						this.x + this.len,
						this.y - this.len * 0.5
					)
					grad.addColorStop(0, 'rgba(255, 255, 255, 0.8)')
					grad.addColorStop(1, 'transparent')
					ctx.strokeStyle = grad
					ctx.lineWidth = 1
					ctx.beginPath()
					ctx.moveTo(this.x, this.y)
					ctx.lineTo(this.x + this.len, this.y - this.len * 0.5)
					ctx.stroke()
					if (this.x < -200) this.reset()
				}
			}
		}

		const stars = Array.from({ length: 120 }, () => new Star())
		const shooters = [new ShootingStar(), new ShootingStar()]

		drawBackground()

		let animationId: number
		const animate = () => {
			drawBackground()
			stars.forEach(s => s.update(ctx))
			shooters.forEach(s => s.update(ctx))
			animationId = requestAnimationFrame(animate)
		}

		animate()

		const handleResize = () => {
			width = canvas.width = window.innerWidth
			height = canvas.height = window.innerHeight
			drawBackground()
		}

		window.addEventListener('resize', handleResize)
		return () => {
			cancelAnimationFrame(animationId)
			window.removeEventListener('resize', handleResize)
		}
	}, [])

	return (
		<canvas
			ref={canvasRef}
			style={{
				position: 'fixed',
				top: 0,
				left: 0,
				width: '100%',
				height: '100%',
				zIndex: -1,
				background: '#000000',
			}}
		/>
	)
}
