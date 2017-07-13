<template>
	<div class="mu-slider" :class="sliderClass" tabindex="0" @touchstart="handleTouchStart" @touchend="handleTouchEnd" @touchcancel="handleTouchEnd" @mousedown="handleMouseDown" @mouseup="handleMouseUp">
		<input type="hidden" :name="name" :value="inputValue">
		<div class="mu-slider-track"></div>
		<div class="mu-slider-fill" :style="fillStyle"></div>
		<div class="mu-slider-thumb" :style="thumbStyle">
		</div>
	</div>
</template>

<script>
	export default {
		name: 'mu-slider',
		props: {
			name: {
				type: String
			},
			value: {
				type: [Number, String],
				default: 0
			},
			max: {
				type: Number,
				default: 100
			},
			min: {
				type: Number,
				default: 0
			},
			step: {
				type: Number,
				default: 0.1
			},
			disabled: {
				type: Boolean,
				default: false
			}
		},
		data() {
			return {
				inputValue: this.value,
				active: false,
				hover: false,
				focused: false,
				dragging: false
			}
		},
		computed: {
			percent() {
				let percentNum = (this.inputValue - this.min) / (this.max - this.min) * 100
				return percentNum > 100 ? 100 : percentNum < 0 ? 0 : percentNum
			},
			fillStyle() {
				return {
					width: this.percent + '%'
				}
			},
			thumbStyle() {
				return {
					left: this.percent + '%'
				}
			},
			sliderClass() {
				return {
					zero: this.inputValue <= this.min,
					active: this.active,
					disabled: this.disabled
				}
			}
		},
		created() {
			this.handleDragMouseMove = this.handleDragMouseMove.bind(this)
			this.handleMouseEnd = this.handleMouseEnd.bind(this)
			this.handleTouchMove = this.handleTouchMove.bind(this)
			this.handleTouchEnd = this.handleTouchEnd.bind(this)
		},
		methods: {
			handleMouseDown(e) {
				if(this.disabled) return
				this.setValue(e)
				e.preventDefault()
				document.addEventListener('mousemove', this.handleDragMouseMove)
				document.addEventListener('mouseup', this.handleMouseEnd)
				this.$el.focus()
				this.onDragStart(e)
			},
			handleMouseUp() {
				if(this.disabled) return
				this.active = false
			},
			handleTouchStart(e) {
				if(this.disabled) return
				this.setValue(e.touches[0])
				document.addEventListener('touchmove', this.handleTouchMove)
				document.addEventListener('touchup', this.handleTouchEnd)
				document.addEventListener('touchend', this.handleTouchEnd)
				document.addEventListener('touchcancel', this.handleTouchEnd)
				e.preventDefault()
				this.onDragStart(e)
			},
			handleTouchEnd(e) {
				if(this.disabled) return
				document.removeEventListener('touchmove', this.handleTouchMove)
				document.removeEventListener('touchup', this.handleTouchEnd)
				document.removeEventListener('touchend', this.handleTouchEnd)
				document.removeEventListener('touchcancel', this.handleTouchEnd)
				this.onDragStop(e)
			},
			// 从点击位置更新 value
			setValue(e) {
				const {
					$el,
					max,
					min,
					step
				} = this
				let value = (e.clientX - $el.getBoundingClientRect().left) / $el.offsetWidth * (max - min)
				value = Math.round(value / step) * step + min
				value = parseFloat(value.toFixed(5))
				if(value > max) {
					value = max
				} else if(value < min) {
					value = min
				}
				this.inputValue = value
				this.$emit('change', value)
			},
			// 拖拽控制
			onDragStart(e) {
				this.dragging = true
				this.active = true
				this.$emit('dragStart', e)
				this.$emit('drag-start', e)
			},
			onDragUpdate(e) {
				if(this.dragRunning) return
				this.dragRunning = true
				window.requestAnimationFrame(() => {
					this.dragRunning = false
					if(!this.disabled) this.setValue(e)
				})
			},
			onDragStop(e) {
				this.dragging = false
				this.active = false
				this.$emit('dragStop', e)
				this.$emit('drag-stop', e)
			},
			handleDragMouseMove(e) {
				this.onDragUpdate(e)
			},
			handleTouchMove(e) {
				this.onDragUpdate(e.touches[0])
			},
			handleMouseEnd(e) {
				document.removeEventListener('mousemove', this.handleDragMouseMove)
				document.removeEventListener('mouseup', this.handleMouseEnd)
				this.onDragStop(e)
			}
		},
		watch: {
			value(val) {
				this.inputValue = val
			},
			inputValue(val) {
				this.$emit('input', val)
			}
		},
		components: {}
	}
</script>

<style lang="less">
	.mu-slider {
		width: 100%;
		position: relative;
		height: 24px;
		display: flex;
		align-items: center;
		cursor: default;
		user-select: none;
		outline: none;
	}
	
	.mu-slider-track {
		position: absolute;
		height: 2px;
		left: 0;
		right: 0;
		top: 50%;
		margin-top: -1px;
		background-color: #fff;
	}
	
	.mu-slider-fill {
		position: absolute;
		height: 2px;
		width: 100%;
		left: 0;
		top: 50%;
		margin-top: -1px;
		background-color: #d33a31;
	}
	
	.mu-slider-thumb:after {
		border: 2px solid #d33a31;
		height: 0;
		width: 0;
		overflow: hidden;
		position: absolute;
		left: 50%;
		top: 50%;
		content: '';
		border-radius: 1em;
		margin-top: -2px;
		margin-left: -2px;
	}
	
	.mu-slider-thumb {
		position: absolute;
		top: 50%;
		width: 16px;
		height: 16px;
		border-radius: 50%;
		transform: translate(-50%, -50%);
		cursor: pointer;
		background-color: #fff;
		box-shadow: 0 1px 3px rgba(0, 0, 0, .4);
		.mu-slider.active & {
			width: 20px;
			height: 20px;
		}
		.mu-slider.zero &,
		.mu-slider.disabled & {
			.mu-focus-ripple-wrapper {
				top: -14px;
				left: -14px;
			}
		}
		.mu-slider.disabled & {
			cursor: default;
		}
		.mu-focus-ripple-wrapper {
			width: 36px;
			height: 36px;
			top: -12px;
			left: -12px;
		}
	}
</style>