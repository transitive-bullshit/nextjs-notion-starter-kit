import { extendTheme } from '@chakra-ui/react'
import { mode } from '@chakra-ui/theme-tools'

const styles = {
  global: (props) => ({
    body: {
      color: mode('black', 'whiteAlpha.900')(props),
      bg: mode('white', '#2f3437')(props)
    }
  })
}
const config = {
  initialColorMode: "light",
  useSystemColorMode: false,
}
// const components = {
//   Link: {
//     baseStyle: (props) => ({
//       color: mode("blue.400", "blue.300")(props),
//     }),
//   },
// };

const theme = extendTheme({
  // components,
  styles,
  config
})

export default theme
