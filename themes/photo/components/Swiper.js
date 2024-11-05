import { useRef, useState } from 'react'
import PostItemCard from './PostItemCard'

const Swiper = ({ posts }) => {
  const [currentIndex, setCurrentIndex] = useState(0) // 当前卡片索引
  const containerRef = useRef(null) // 滚动容器引用

  // 拖拽相关引用变量
  const touchStartPos = useRef(0) // 记录触摸的起始X位置
  const touchEndPos = useRef(0) // 记录触摸的结束X位置
  const isDragging = useRef(false) // 是否处于拖拽状态

  // 处理拖拽开始
  const handleDragStart = e => {
    const x = e.touches ? e.touches[0].clientX : e.clientX // 获取X坐标
    touchStartPos.current = x
    isDragging.current = true
  }

  // 处理拖拽移动
  const handleDragMove = e => {
    if (!isDragging.current) return
    const x = e.touches ? e.touches[0].clientX : e.clientX
    touchEndPos.current = x
  }

  // 处理拖拽结束
  const handleDragEnd = () => {
    isDragging.current = false
    const deltaX = touchStartPos.current - touchEndPos.current // 拖拽的X方向位移

    // 判断拖拽方向并滑动
    if (deltaX > 50) {
      // 向左滑动
      handleNext()
    } else if (deltaX < -50) {
      // 向右滑动
      handlePrev()
    }
  }

  // 滚动到指定索引的卡片
  const scrollToCard = index => {
    const container = containerRef.current
    if (!container) return
    const cardWidth = container.offsetWidth // 取容器的宽度，即单个卡片宽度
    const scrollPosition = index * cardWidth // 计算目标卡片的起始位置
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
        <div className='flex transition-transform' style={{ width: '100%' }}>
          {posts.map((item, index) => (
            <div key={index} className='w-full flex-shrink-0'> {/* 设置宽度为100% */}
              <PostItemCard post={item} /> {/* 渲染每个卡片 */}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Swiper
