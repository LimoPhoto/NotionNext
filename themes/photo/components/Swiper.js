import { useRef, useState } from 'react'
import PostItemCard from './PostItemCard'

const Swiper = ({ posts }) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const containerRef = useRef(null)

  // 拖拽相关引用变量
  const touchStartPos = useRef({ x: 0, y: 0 })
  const isDragging = useRef(false)
  const scrollStartLeft = useRef(0)

  // 处理拖拽开始
  const handleDragStart = e => {
    const x = e.touches ? e.touches[0].clientX : e.clientX
    touchStartPos.current = { x }
    isDragging.current = true
    scrollStartLeft.current = containerRef.current.scrollLeft
    containerRef.current.style.cursor = 'grabbing'
  }

  // 处理拖拽移动
  const handleDragMove = e => {
    if (!isDragging.current) return
    const x = e.touches ? e.touches[0].clientX : e.clientX
    const deltaX = touchStartPos.current.x - x
    containerRef.current.scrollLeft = scrollStartLeft.current + deltaX
  }

  // 处理拖拽结束
  const handleDragEnd = () => {
    isDragging.current = false
    containerRef.current.style.cursor = 'grab'
  }

  // 滚动到指定索引的卡片
  const scrollToCard = index => {
    const container = containerRef.current
    if (!container) return
    const cardWidth = container.offsetWidth * 0.75 // 取卡片宽度的 75%
    const scrollPosition = index * cardWidth - (container.offsetWidth - cardWidth) / 2 // 居中计算
    container.scrollTo({
      left: scrollPosition,
      behavior: 'smooth',
    })
  }

  // 处理点击左箭头
  const handlePrev = () => {
    const newIndex = currentIndex > 0 ? currentIndex - 1 : posts.length - 1
    setCurrentIndex(newIndex)
    scrollToCard(newIndex)
  }

  // 处理点击右箭头
  const handleNext = () => {
    const newIndex = (currentIndex + 1) % posts.length
    setCurrentIndex(newIndex)
    scrollToCard(newIndex)
  }

  return (
    <div className='relative w-full mx-auto px-12 my-8'>
      {/* 左侧箭头按钮 */}
      <div
        className='absolute inset-y-0 left-4 z-10 cursor-pointer flex items-center justify-center'
        onClick={handlePrev}>
        <span className='text-3xl text-gray-700 hover:text-gray-900'>&#10094;</span>
      </div>

      {/* 右侧箭头按钮 */}
      <div
        className='absolute inset-y-0 right-4 z-10 cursor-pointer flex items-center justify-center'
        onClick={handleNext}>
        <span className='text-3xl text-gray-700 hover:text-gray-900'>&#10095;</span>
      </div>

      {/* 滑动区域 */}
      <div
        ref={containerRef}
        className='relative w-full overflow-x-hidden py-4 cursor-grab flex justify-center'
        onTouchStart={handleDragStart}
        onTouchMove={handleDragMove}
        onTouchEnd={handleDragEnd}
        onMouseDown={handleDragStart}
        onMouseMove={handleDragMove}
        onMouseUp={handleDragEnd}
        onMouseLeave={handleDragEnd}
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        <div className='flex gap-x-4 transition-transform'>
          {posts.map((item, index) => (
            <div key={index} className='w-3/4 flex-shrink-0'>
              <PostItemCard post={item} /> {/* 渲染每个卡片 */}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Swiper
