import { useState } from 'react';


function Test() {
    const [Name, SetName] = useState('Life')
    const [Age, SetAge] = useState(30)

    console.log('The name right now is ', { Name }, 'Age', { Age })
    
    const HandleClick = () =>
    {
        console.log
        SetName('React')
        SetAge(31)
        console.log("The name is now ", {Name}, 'Age is now' ,{Age})
    }

    return (
        <div className="test">
            <h1>The name is {Name}</h1>
            <input type = "submit" className="Button" value = "Click Me" OnClick = {() => HandleClick}></input>
        </div>
    );
}



export default Test
