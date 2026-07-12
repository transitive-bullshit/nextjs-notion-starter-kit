import { Info } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import * as React from 'react'

import { ImLab } from '@/components/icons/InlineIcons'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail
} from '@/components/ui/sidebar'
import { useOwnerMode } from '@/components/wustep/OwnerModeProvider'
import { playgroundSections } from '@/playground/registry'

const defaultDescription = "Welcome to Stephen's code playground."

type AboutState = {
  description: string
  date?: string
  article?: string
  source?: string
  x?: string
}

export function PlaygroundSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const router = useRouter()
  const { isOwner } = useOwnerMode()
  const visibleSections = React.useMemo(
    () =>
      playgroundSections
        .map((section) => ({
          ...section,
          items: section.items.filter((item) => !item.ownerOnly || isOwner)
        }))
        .filter((section) => section.items.length > 0),
    [isOwner]
  )
  const activeItem =
    visibleSections
      .flatMap((section) => section.items)
      .find((item) => {
        return item.url === router.pathname
      }) ?? null

  const [aboutInfo, setAboutInfo] = React.useState<AboutState>({
    description: activeItem?.description ?? defaultDescription,
    date: activeItem?.date,
    article: activeItem?.article,
    source: activeItem?.source,
    x: activeItem?.x
  })

  React.useEffect(() => {
    setAboutInfo({
      description: activeItem?.description ?? defaultDescription,
      date: activeItem?.date,
      article: activeItem?.article,
      source: activeItem?.source,
      x: activeItem?.x
    })
  }, [activeItem])

  const resetDescription = () =>
    setAboutInfo({
      description: activeItem?.description ?? defaultDescription,
      date: activeItem?.date,
      article: activeItem?.article,
      source: activeItem?.source,
      x: activeItem?.x
    })

  const metadataItems: React.ReactNode[] = []
  if (aboutInfo.date) {
    metadataItems.push(<span key='date'>{aboutInfo.date}</span>)
  }
  if (aboutInfo.article) {
    metadataItems.push(
      <Link
        key='article'
        href={aboutInfo.article}
        className='underline underline-offset-2 hover:text-sidebar-primary transition-colors'
      >
        Article
      </Link>
    )
  }
  if (aboutInfo.x) {
    metadataItems.push(
      <Link
        key='x'
        href={aboutInfo.x}
        className='underline underline-offset-2 hover:text-sidebar-primary transition-colors'
      >
        Post
      </Link>
    )
  }
  if (aboutInfo.source) {
    metadataItems.push(
      <Link
        key='source'
        href={aboutInfo.source}
        className='underline underline-offset-2 hover:text-sidebar-primary transition-colors'
      >
        Source
      </Link>
    )
  }

  return (
    <Sidebar className='sidebar-animate' {...props}>
      <SidebarHeader className='gap-3'>
        <div className='flex items-center gap-2 rounded-lg border border-border/60 bg-sidebar p-3'>
          <Link href='/playground' aria-label='Playground home'>
            <ImLab className='playground-sidebar-lab size-4' />
          </Link>
          <div className='leading-tight flex items-center gap-1 align-baseline'>
            <Link href='/playground' className='text-sm font-semibold'>
              Playground
            </Link>
            <Link
              href='https://wustep.me'
              className='text-xs text-muted-foreground hover:text-sidebar-primary transition-colors'
              target='_blank'
              rel='noreferrer'
            >
              by wustep
            </Link>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        {visibleSections.map((section) => (
          <SidebarGroup key={section.title}>
            <SidebarGroupLabel>{section.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {section.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={router.pathname === item.url}
                      disabled={!!item.disabled}
                      onMouseEnter={() =>
                        setAboutInfo({
                          description: item.description,
                          date: item.date,
                          article: item.article,
                          source: item.source,
                          x: item.x
                        })
                      }
                      onFocus={() =>
                        setAboutInfo({
                          description: item.description,
                          date: item.date,
                          article: item.article,
                          source: item.source,
                          x: item.x
                        })
                      }
                      onMouseLeave={resetDescription}
                      onBlur={resetDescription}
                    >
                      {item.disabled ? (
                        // The menu button's aria-disabled:opacity-50 is the
                        // single dimmer; don't stack a second opacity here.
                        <span className='flex w-full items-center justify-between gap-2 text-muted-foreground'>
                          <span className='truncate'>{item.title}</span>
                          {item.year ? (
                            <span className='text-[11px]'>{item.year}</span>
                          ) : null}
                        </span>
                      ) : (
                        <Link
                          href={item.url}
                          className='flex w-full items-center justify-between gap-2'
                        >
                          <span className='truncate'>{item.title}</span>
                          {item.year ? (
                            <span className='text-[11px] text-muted-foreground'>
                              {item.year}
                            </span>
                          ) : null}
                        </Link>
                      )}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter className='border-t border-sidebar-border/50 px-4 py-3 text-xs leading-relaxed text-muted-foreground min-h-[145px]'>
        <div className='flex items-center gap-1 text-sidebar-foreground mb-1 font-medium'>
          <Info className='size-3.5' />
          <span>About</span>
        </div>
        <p>{aboutInfo.description}</p>
        {metadataItems.length ? (
          <p className='mt-1 text-[11px] text-muted-foreground flex items-center gap-1'>
            {metadataItems.map((item, index) => (
              <React.Fragment key={index}>
                {index > 0 ? <span aria-hidden='true'>&bull;</span> : null}
                {item}
              </React.Fragment>
            ))}
          </p>
        ) : null}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
