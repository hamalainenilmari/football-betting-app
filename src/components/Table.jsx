import { useState, useEffect } from 'react'
import { getAll } from '../services/userManagement';
import '../styles/tableStyle.css'
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


    return (
        <div className="containerStyle">
            <div className="titleStyle">Tilanne</div>
            <div className="headerStyle">
                
                <span>Pelurit</span>
                <span>Pojot</span>
            </div>
            {users.map((user,index) => (
                <div key={user.id} className="userStyle">
                    <span className="nameStyle">{index + 1}.</span>
                    <span className="nameStyle" style={{flex: "3", textalign: "left",paddingLeft:"5px"}}>{user.username}</span>
                    <span className="nameStyle">{user.points}</span>
                </div>
            ))}
        </div>
    );
};


export default Table