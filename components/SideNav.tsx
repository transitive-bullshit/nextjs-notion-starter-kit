import { NavigationList, NavItem } from 'nav'
import Link from 'next/link'
import * as React from 'react'
import { atom, useAtom } from 'jotai'
import { Dialog, Transition } from '@headlessui/react'
import classNames from 'classnames'
import { useRouter } from 'next/router'

export const navOpenAtom = atom<boolean>(false)

const Item = ({ name, to, items }: NavItem) => {
  const router = useRouter()
  const focus = router.pathname === to
  const className = classNames(
    'px-1 py-1 w-full inline-block bg-black hover:bg-black dark:bg-white dark:hover:bg-white rounded',
    focus
      ? 'bg-opacity-5 hover:bg-opacity-10 dark:bg-opacity-5 dark:hover:bg-opacity-10'
      : 'bg-opacity-0 hover:bg-opacity-5 dark:bg-opacity-0 dark:hover:bg-opacity-5'
  )
  return (
    <div>
      {items ? (
        <div className={'font-bold'}>{name}</div>
      ) : (
        <Link href={to} passHref>
          <a className={className}>{name}</a>
        </Link>
      )}
      {items && (
        <div className='ml-2 flex flex-col gap-y-0.5 mt-1'>
          {items?.map((props, index) => (
            <Item key={index} {...props} />
          ))}
        </div>
      )}
    </div>
  )
}

// const useIsMobile = () => {
//   const isMobile = () => {
//     if (typeof window === 'undefined') {
//       return true
//     }
//     const { innerWidth: width } = window
//     return width < 768
//   }

//   const [state, setState] = React.useState<boolean>(isMobile())

//   React.useEffect(() => {
//     function handleResize() {
//       setState(isMobile())
//     }

//     window.addEventListener('resize', handleResize)
//     return () => window.removeEventListener('resize', handleResize)
//   }, [])

// return state
// }

export const SideNav = () => {
  const [isOpen, setIsOpen] = useAtom(navOpenAtom)
  // const isMobile = useIsMobile()

  return (
    <>
      <Transition appear show={isOpen} as={React.Fragment}>
        <Dialog
          as='div'
          className='fixed inset-0 z-[200] h-full'
          onClose={() => setIsOpen(false)}
        >
          <Transition.Child
            as={React.Fragment}
            enter='transition ease-in-out duration-200 transform'
            enterFrom='-translate-x-full'
            enterTo='translate-x-0'
            leave='transition ease-in-out duration-200 transform'
            leaveFrom='translate-x-0'
            leaveTo='-translate-x-full'
          >
            <Dialog.Panel className='relative z-10 flex h-full w-[300px] flex-col border-r border-gray-100 dark:border-gray-600 bg-[#FBFBFA] p-4 shadow dark:bg-[#202020] dark:text-white gap-y-4'>
              {NavigationList.map((props, index) => (
                <Item key={index} {...props} />
              ))}
            </Dialog.Panel>
          </Transition.Child>
          <Transition.Child
            as={React.Fragment}
            enter='ease-out duration-300'
            enterFrom='opacity-0'
            enterTo='opacity-100'
            leave='ease-in duration-200'
            leaveFrom='opacity-100'
            leaveTo='opacity-0'
          >
            <Dialog.Overlay className='fixed inset-0 bg-gray-600 bg-opacity-50'></Dialog.Overlay>
          </Transition.Child>
        </Dialog>
      </Transition>

      {/* <Transition
        appear
        show={isOpen}
        as={'div'}
        enter='transition ease-in-out duration-200 transform'
        enterFrom='-translate-x-full'
        enterTo='translate-x-0'
        leave='transition ease-in-out duration-200 transform'
        leaveFrom='translate-x-0'
        leaveTo='-translate-x-full'
        className='w-[300px] h-full flex-grow-0 hidden md:block p-4 bg-[#FBFBFA] dark:bg-[#202020] fixed left-0 border-gray-200 dark:border-gray-600 border-r'
      >
        {NavigationList.map((props, index) => (
          <Item key={index} {...props} />
        ))}
      </Transition> */}
    </>
  )
}

export const OpenNavButton = () => {
  const [, setOpen] = useAtom(navOpenAtom)
  return (
    <button onClick={() => setOpen((d) => !d)} className='p-3'>
      <svg
        stroke='currentColor'
        fill='none'
        strokeWidth='2'
        viewBox='0 0 24 24'
        strokeLinecap='round'
        strokeLinejoin='round'
        height='1em'
        width='1em'
        xmlns='http://www.w3.org/2000/svg'
      >
        <line x1='3' y1='12' x2='21' y2='12'></line>
        <line x1='3' y1='6' x2='21' y2='6'></line>
        <line x1='3' y1='18' x2='21' y2='18'></line>
      </svg>
    </button>
  )
}

export const ContentWrapper = ({ children }: { children: React.ReactNode }) => {
  const [isOpen] = useAtom(navOpenAtom)
  return (
    <div
      className={classNames(
        'h-full w-full transition-all duration-200 ease-linear',
        isOpen ? 'ml-[300px]' : 'ml-0 transform-none'
      )}
    >
      {children}
    </div>
  )
}
