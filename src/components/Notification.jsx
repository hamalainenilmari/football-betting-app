import _ from 'lodash'
import  '../styles/notificationStyle.css'
import miika from './miika.png'
import yahye from '../styles/yahye.png'
import dani from '../styles/dani2.png'
import jami from '../styles/jami.png'
import roope from '../styles/roope.png'
import lukas from '../styles/lukas.png'
import janne from '../styles/janne.png'
import miikka from '../styles/janne.png'


function getRandomPic() {
  const pics = [miika, yahye, dani, jami, roope, lukas, janne, miikka]
  const int = _.random(0, pics.length - 1)
  console.log("rand " + int)
  return pics[int]
}

const icons = {
  success: getRandomPic(),
  danger: getRandomPic(),
  warning: getRandomPic(),
  info: getRandomPic(),
  login: getRandomPic()
};

const notificationStyles = {
  base: {
    position: 'fixed',
    top: '25px',
    right: '25px',
    maxWidth: '80%',
    background: '#fff',
    padding: '0.5rem 1rem',
    borderRadius: '10px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.3)',
    zIndex: 1023,
    display: 'flex',
    alignItems: 'center',
    animation: 'slideInRight 0.3s ease-in-out forwards, fadeOut 0.5s ease-in-out forwards 3s',
  },
  success: { background: '#d4f3e0' },
  danger: { background: '#efaca5' },
  info: { background: '#bddaed' },
  warning: { background: '#ead994' },
};

const iconStyles = {
  width: '120px', 
  height: 'auto',
  marginRight: '8px', 
};

// eslint-disable-next-line react/prop-types
const Notification = ({ message, type }) => {

  const style = {
    ...notificationStyles.base,
    ...(notificationStyles[type] || notificationStyles.info),
  };

    if (message === null) {
      return null
    }
  
    return (
      <div style={style} className={`notification notification-${type}`}>
        <span className="icon">
          {type === 'success' && <img src={icons.success} style={iconStyles}/>}
          {type === 'danger' && <img src={icons.success} style={iconStyles}/>}
          {type === 'info' && <img src={icons.success} style={iconStyles}/>}
          {type === 'warning' && <img src={icons.success} style={iconStyles}/>}
          {type === 'login' && <img src={icons.login} style={iconStyles}/>}
        </span>
        <span className="toast-message">{message}</span>
        <div className='toast-progress'></div>
      </div>
    );
  }
  
  export default Notification