import miika from '../styles/miika3.jpg'
//https://mail.google.com/mail/u/0?ui=2&ik=e87176f844&attid=0.1&permmsgid=msg-a:r-2877609696891080198&th=1904fd3983b6847e&view=fimg&fur=ip&sz=s0-l75-ft&attbid=ANGjdJ_74A_B8SOOyziuR8TlXWGueuc3BiXnpfMtbKm2inLXMgulw13u9XV6ROlGVPkqY49JlYVyf8PQx0ZrjiFib80FYy523gi7gt5pniJm11he_AW0kQlz1p60920&disp=emb&realattid=4DC63109-CE29-42AC-A459-66A96327755B
const notificationStyle = {
  position: 'fixed',
  top: '0',
  left: '0',
  width: '100%',
  padding: '20px',
  //boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
  zIndex: 1000,
  minHeight: '420px',
  backgroundImage: `url(${miika})`,
  backgroundSize: '100% auto',
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'contain',
  display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    color: '#fff',
    fontWeight: 'bold', // Adjust font weight as needed
    overflow: 'hidden',
    //textShadow: '0 0 20px black',
    fontSize: '4vw',
    textShadow: '0 0 20px rgba(0, 0, 0, 0.5)', // Text shadow for better readability
    filter: 'brightness(80%) contrast(110%)', // Adjust brightness and contrast
    boxShadow: '0 0 20px rgba(0, 0, 0, 0.2) inset'
};

// eslint-disable-next-line react/prop-types
const Notification = ({ message }) => {
    if (message === null) {
      return null
    }
  
    return (
      <div style={notificationStyle}>
        {message}
      </div>
    )
  }
  
  export default Notification