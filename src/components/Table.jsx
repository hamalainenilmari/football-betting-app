import { useState, useEffect } from 'react'
import { getAll } from '../services/userManagement';

const Table = () => {
    const [users, setUsers] = useState([])

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const users = await getAll();
                users.sort((a,b) => b.points - a.points)
                setUsers(users);
                console.log("users " + users);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        }
        fetchUsers()
      }, []);

      const containerStyle = {
        padding: '20px',
        maxWidth: '600px',
        margin: '0 auto',
        backgroundColor: '#f4f4f4',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
    };

    const userStyle = {
        display: 'flex',
        justifyContent: 'space-between',
        padding: '10px',
        borderBottom: '1px solid #ddd'
    };

    const headerStyle = {
        display: 'flex',
        justifyContent: 'space-between',
        fontWeight: 'bold',
        padding: '10px',
        borderBottom: '2px solid #000',
        fontSize: '18px'
    };

    const titleStyle = {
        textAlign: 'center',
        fontSize: '24px',
        marginBottom: '20px'
    };

    return (
        <div style={containerStyle}>
            <div style={titleStyle}>Tilanne</div>
            <div style={headerStyle}>
                <span>Pelurit</span>
                <span>Pojot</span>
            </div>
            {users.map(user => (
                <div key={user.id} style={userStyle}>
                    <span>{user.username}</span>
                    <span>{user.points}</span>
                </div>
            ))}
        </div>
    );
};


export default Table