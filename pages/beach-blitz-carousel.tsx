import Countdown from 'react-countdown'
const BeachBlitzCarousel = (props) => {
  return (
    <a
      href='https://beachblitz.ocra.io'
      target='_top'
    >
      <div style={{display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width:'100vw',
          height:'100vh',
          backgroundColor:"#99cc33",
          backgroundImage: `url('https://beachblitz.ocra.io/assets/img/logo.svg')`,
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'contain',
          backgroundPosition: 'center',
          color: 'black',
          fontSize: '12vw',
          fontWeight: 'bolder'
        }}
      >
        <div
          style={{
            position:"absolute",
            top:"3vh",
            textAlign: 'center',
            padding: '5px',
            
          }}
        >
          <div style={{ fontSize: '6vw' }}>
            Team 6995 is excited to play in
          </div>
        </div>
        <div
          style={{
            position:"absolute",
            bottom:"3vh",
            textAlign: 'center',
            padding: '5px',
            
          }}
        >
          <div style={{ fontSize: '6vw' }}>
            Click to learn more!
          </div>
        </div>
      </div>
    </a>
  )
}
export default BeachBlitzCarousel
