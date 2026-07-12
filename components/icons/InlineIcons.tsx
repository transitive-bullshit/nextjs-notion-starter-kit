import * as React from 'react'

// Inline SVGs copied from react-icons (@react-icons/all-files) to avoid server bundling issues.

export type IconProps = React.SVGProps<SVGSVGElement> & {
  size?: number | string
  title?: string
}

type IconBaseProps = IconProps & {
  viewBox: string
}

function IconBase({
  viewBox,
  size = '1em',
  title,
  style,
  children,
  ...props
}: IconBaseProps) {
  const hasLabel =
    !!title || !!props['aria-label'] || !!props['aria-labelledby']
  const mergedStyle = { verticalAlign: 'middle', ...style }

  return (
    <svg
      viewBox={viewBox}
      width={size}
      height={size}
      stroke='currentColor'
      fill='currentColor'
      strokeWidth='0'
      xmlns='http://www.w3.org/2000/svg'
      role={hasLabel ? 'img' : undefined}
      aria-hidden={hasLabel ? undefined : true}
      style={mergedStyle}
      {...props}
    >
      {title ? <title>{title}</title> : null}
      {children}
    </svg>
  )
}

export function IoMoonSharp(props: IconProps) {
  return (
    <IconBase viewBox='0 0 512 512' {...props}>
      <path d='M152.62 126.77c0-33 4.85-66.35 17.23-94.77C87.54 67.83 32 151.89 32 247.38 32 375.85 136.15 480 264.62 480c95.49 0 179.55-55.54 215.38-137.85-28.42 12.38-61.8 17.23-94.77 17.23-128.47 0-232.61-104.14-232.61-232.61z' />
    </IconBase>
  )
}

export function IoSunnyOutline(props: IconProps) {
  return (
    <IconBase viewBox='0 0 512 512' {...props}>
      <path
        fill='none'
        strokeLinecap='round'
        strokeMiterlimit='10'
        strokeWidth='32'
        d='M256 48v48m0 320v48m147.08-355.08l-33.94 33.94M142.86 369.14l-33.94 33.94M464 256h-48m-320 0H48m355.08 147.08l-33.94-33.94M142.86 142.86l-33.94-33.94'
      />
      <circle
        cx='256'
        cy='256'
        r='80'
        fill='none'
        strokeLinecap='round'
        strokeMiterlimit='10'
        strokeWidth='32'
      />
    </IconBase>
  )
}

export function ImLab(props: IconProps) {
  return (
    <IconBase viewBox='0 0 16 16' {...props}>
      <path d='M14.942 12.57l-4.942-8.235v-3.335h0.5c0.275 0 0.5-0.225 0.5-0.5s-0.225-0.5-0.5-0.5h-5c-0.275 0-0.5 0.225-0.5 0.5s0.225 0.5 0.5 0.5h0.5v3.335l-4.942 8.235c-1.132 1.886-0.258 3.43 1.942 3.43h10c2.2 0 3.074-1.543 1.942-3.43zM3.766 10l3.234-5.39v-3.61h2v3.61l3.234 5.39h-8.468z' />
    </IconBase>
  )
}

/**
 * House icon. Stroked outline at rest, fills with `currentColor` on hover
 * via the `.house-body` class (wired up in wustep.css).
 */
export function HouseFillIcon(props: IconProps) {
  return (
    <IconBase
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
      {...props}
    >
      <path
        className='house-body'
        d='M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z'
      />
    </IconBase>
  )
}

/**
 * Flask icon with an animated liquid fill.
 * Hovering or keyboard-focusing an ancestor link/button raises the liquid
 * from empty up to the flask's shoulder. See `.lab-fill-liquid` in wustep.css.
 */
export function LabFillIcon(props: IconProps) {
  const reactId = React.useId()
  const cavityId = `lab-cavity-${reactId.replaceAll(':', '')}`

  return (
    <IconBase viewBox='0 0 16 16' {...props}>
      <defs>
        <clipPath id={cavityId}>
          {/* Inner cavity: thin neck + triangular body */}
          <path d='M3.85 10 L7 4.6 V1.3 H9 V4.6 L12.15 10 Z' />
        </clipPath>
      </defs>

      {/* Liquid fill (clipped to cavity). Hidden at rest, rises on hover. */}
      <g clipPath={`url(#${cavityId})`}>
        <rect
          className='lab-fill-liquid'
          x='0'
          y='0'
          width='16'
          height='16'
          fill='currentColor'
        />
      </g>

      {/* Flask outline (sits on top of the liquid) */}
      <path
        className='lab-fill-outline'
        d='M14.942 12.57l-4.942-8.235v-3.335h0.5c0.275 0 0.5-0.225 0.5-0.5s-0.225-0.5-0.5-0.5h-5c-0.275 0-0.5 0.225-0.5 0.5s0.225 0.5 0.5 0.5h0.5v3.335l-4.942 8.235c-1.132 1.886-0.258 3.43 1.942 3.43h10c2.2 0 3.074-1.543 1.942-3.43zM3.766 10l3.234-5.39v-3.61h2v3.61l3.234 5.39h-8.468z'
      />
    </IconBase>
  )
}

export function IoGridOutline(props: IconProps) {
  return (
    <IconBase viewBox='0 0 512 512' {...props}>
      <rect
        width='176'
        height='176'
        x='48'
        y='48'
        fill='none'
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth='32'
        rx='20'
        ry='20'
      />
      <rect
        width='176'
        height='176'
        x='288'
        y='48'
        fill='none'
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth='32'
        rx='20'
        ry='20'
      />
      <rect
        width='176'
        height='176'
        x='48'
        y='288'
        fill='none'
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth='32'
        rx='20'
        ry='20'
      />
      <rect
        width='176'
        height='176'
        x='288'
        y='288'
        fill='none'
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth='32'
        rx='20'
        ry='20'
      />
    </IconBase>
  )
}

export function IoListOutline(props: IconProps) {
  return (
    <IconBase viewBox='0 0 512 512' {...props}>
      <path
        fill='none'
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth='32'
        d='M160 144h288M160 256h288M160 368h288'
      />
      <circle
        cx='80'
        cy='144'
        r='16'
        fill='none'
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth='32'
      />
      <circle
        cx='80'
        cy='256'
        r='16'
        fill='none'
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth='32'
      />
      <circle
        cx='80'
        cy='368'
        r='16'
        fill='none'
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth='32'
      />
    </IconBase>
  )
}

export function AiOutlineRetweet(props: IconProps) {
  return (
    <IconBase viewBox='0 0 1024 1024' {...props}>
      <path d='M136 552h63.6c4.4 0 8-3.6 8-8V288.7h528.6v72.6c0 1.9.6 3.7 1.8 5.2a8.3 8.3 0 0 0 11.7 1.4L893 255.4c4.3-5 3.6-10.3 0-13.2L749.7 129.8a8.22 8.22 0 0 0-5.2-1.8c-4.6 0-8.4 3.8-8.4 8.4V209H199.7c-39.5 0-71.7 32.2-71.7 71.8V544c0 4.4 3.6 8 8 8zm752-80h-63.6c-4.4 0-8 3.6-8 8v255.3H287.8v-72.6c0-1.9-.6-3.7-1.8-5.2a8.3 8.3 0 0 0-11.7-1.4L131 768.6c-4.3 5-3.6 10.3 0 13.2l143.3 112.4c1.5 1.2 3.3 1.8 5.2 1.8 4.6 0 8.4-3.8 8.4-8.4V815h536.6c39.5 0 71.7-32.2 71.7-71.8V480c-.2-4.4-3.8-8-8.2-8z' />
    </IconBase>
  )
}

export function IoHeartOutline(props: IconProps) {
  return (
    <IconBase viewBox='0 0 512 512' {...props}>
      <path
        fill='none'
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth='32'
        d='M352.92 80C288 80 256 144 256 144s-32-64-96.92-64c-52.76 0-94.54 44.14-95.08 96.81-1.1 109.33 86.73 187.08 183 252.42a16 16 0 0018 0c96.26-65.34 184.09-143.09 183-252.42-.54-52.67-42.32-96.81-95.08-96.81z'
      />
    </IconBase>
  )
}

/** X (Twitter) logo, from react-icons' RiTwitterXFill. */
export function RiTwitterX(props: IconProps) {
  return (
    <IconBase viewBox='0 0 24 24' {...props}>
      <path d='M8 2H1l8.26 11.014L1.45 22h2.65l6.388-7.349L16 22h7L14.392 10.522 21.8 2h-2.65l-5.986 6.886L8 2Zm9 18L5 4h2l12 16h-2Z' />
    </IconBase>
  )
}
