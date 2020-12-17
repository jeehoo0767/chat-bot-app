import React from 'react'
import Axios from 'axios'

function Chatbot() {

    const textQuery = async (text) => {
        // 우리가 보낸 메세지를 관리 한다.
        let conversation = {
            who : 'user',
            content : { // 우리가 보낸 text
                text : {
                    text : text
                }
            }
        }

        const textQueryVariables ={
            text
        }

        // 챗봇이 보낸 메세지를 관리.
        try {
            const response = await Axios.post('/api/dialogflow/textQuery', textQueryVariables)
            const content = response.data.fulfillmentMessages[0]

            conversation = {
                who : 'bot',
                content : content
            }
            console.log(conversation)
        } catch(error) {
            conversation = {
                who : 'user',
                content : { // 우리가 보낸 text
                    text : {
                        text : " Error just occured, please check the problem"
                    }
                }
            }
            console.log(conversation)
        }
    }

    const keyPressHandler = (e) => {
        if(e.key === "Enter") {
            if(!e.target.value) {
                return alert('you need to type something first')
            }

            // textquery 라우트에 요청을 보내야 한다

            textQuery(e.target.value);

            e.target.value = "";
        }
    }

    return (
        <div style={{ height : 700, width : 700, border : '3px solid black', borderRadius : '7px'}}>
            <div style={{ height : 644, width : '100%', overflow : 'auto' }}>

            </div>
            <input 
                style={{ margin : 0, width : '100%', height : 50, 
                borderRadius : '4px', padding : '5px', fontSize : '1rem'
            }}
            placeholder="Send a meassage..."
            onKeyPress={keyPressHandler}
            type="text"
            />
        </div>
    )
}

export default Chatbot
