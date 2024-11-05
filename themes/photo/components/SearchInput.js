import { useRouter } from 'next/router'
import { useGlobal } from '@/lib/global'
import { useImperativeHandle, useRef, useState } from 'react'

let lock = false

const SearchInput = ({ currentTag, keyword, cRef }) => {
  const { locale } = useGlobal()
  const router = useRouter()
  const searchInputRef = useRef(null)
  
  useImperativeHandle(cRef, () => {
    return {
      focus: () => {
        searchInputRef?.current?.focus()
      }
    }
  })
  
  const handleSearch = () => {
    const key = searchInputRef.current.value
    if (key && key !== '') {
      router.push({ pathname: '/search/' + key }).then(r => {
        console.log('搜索', key)
      })
    } else {
      router.push({ pathname: '/' }).then(r => {})
    }
  }

  const handleKeyUp = (e) => {
    if (e.keyCode === 13) { // Enter key
      handleSearch(searchInputRef.current.value)
    } else if (e.keyCode === 27) { // ESC key
      cleanSearch()
    }
  }

  const cleanSearch = () => {
    searchInputRef.current.value = ''
    setShowClean(false)
  }

  function lockSearchInput() {
    lock = true
  }

  function unLockSearchInput() {
    lock = false
  }

  const [showClean, setShowClean] = useState(false)
  const updateSearchKey = (val) => {
    if (lock) return
    searchInputRef.current.value = val
    setShowClean(!!val)
  }

  return (
    <section className='flex w-full bg-gray-100'>
      <input
        ref={searchInputRef}
        type='text'
        placeholder={currentTag ? `${locale.SEARCH.TAGS} #${currentTag}` : `${locale.SEARCH.ARTICLES}`}
        className='outline-none w-full text-sm pl-4 transition focus:shadow-lg font-light leading-10 text-black bg-gray-100 dark:bg-gray-900 dark:text-white'
        onKeyUp={handleKeyUp}
        onCompositionStart={lockSearchInput}
        onCompositionUpdate={lockSearchInput}
        onCompositionEnd={unLockSearchInput}
        onChange={e => updateSearchKey(e.target.value)}
        defaultValue={keyword || ''}
      />

      {/* 移除图标部分 */}
      {showClean && (
        <div className='-ml-12 cursor-pointer dark:bg-gray-600 dark:hover:bg-gray-800 float-right items-center justify-center py-2'>
          <i className='hover:text-black transform duration-200 text-gray-400 cursor-pointer fas fa-times' onClick={cleanSearch} />
        </div>
      )}
    </section>
  )
}

export default SearchInput
