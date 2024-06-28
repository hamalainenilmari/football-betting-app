import  '../styles/notificationStyle.css'
import miika from './miika.png'
import yahye from '../styles/yahye.png'
const icons = {
  success: miika,
  danger: miika,
  warning: miika,
  info: miika,
  login: yahye
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
  width: '120px', // Adjust the size as needed
  height: 'auto', // Maintain aspect ratio
  marginRight: '8px', // Adjust spacing if necessary
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