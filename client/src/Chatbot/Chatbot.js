import React, { useEffect } from 'react'
import Axios from 'axios'
import { useDispatch, useSelector } from 'react-redux';
import { saveMessage } from '../_actions/message_actions';
import Message from './Section/Message'
import Card from './Section/Card'
import { List, Icon, Avatar } from 'antd';
function Chatbot() {
    const dispatch = useDispatch();
    const messagesFromRdux = useSelector(state => state.message.messages)

    useEffect(() => {
        eventQuery('welcomeToMyWebsite');
    }, [])

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
        dispatch(saveMessage(conversation))
        // 챗봇이 보낸 메세지를 관리.
        try {
            const response = await Axios.post('/api/dialogflow/textQuery', textQueryVariables)

            for(let content of response.data.fulfillmentMessages) {
                let conversation = {
                    who : 'bot',
                    content : content
                }
                dispatch(saveMessage(conversation))
                
            }

        } catch(error) {
            conversation = {
                who : 'user',
                content : { // 우리가 보낸 text
                    text : {
                        text : " Error just occured, please check the problem"
                    }
                }
            }
            dispatch(saveMessage(conversation))
        }
    }

    const eventQuery = async (event) => {
       
        const eventQueryVariables ={
            event
        }

        // 챗봇이 보낸 메세지를 관리.
        try {
            const response = await Axios.post('/api/dialogflow/eventQuery', eventQueryVariables)
            for(let content of response.data.fulfillmentMessages) {
                let conversation = {
                    who : 'bot',
                    content : content
                }
                dispatch(saveMessage(conversation))
                
            }
        } catch(error) {
            let conversation = {
                who : 'user',
                content : { // 우리가 보낸 text
                    text : {
                        text : " Error just occured, please check the problem"
                    }
                }
            }
            dispatch(saveMessage(conversation))
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

    const renderCards = (cards) => {
        return cards.map((card, i) => <Card key={i} cardInfo={card.structValue}/>)
    }

    const renderOneMessage = (message, i) => {
        console.log(message);

        // Template for normal text
        if(message.content && message.content.text && message.content.text.text){
        return <Message key={i} who={message.who} text={message.content.text.text}/>
        } else if(message.content && message.content.payload.fields.card) {
            //template for card message

            const AvatarSrc = message.who ==='bot' ? <Icon type="robot" /> : <Icon type="smile" />

            return <div>
                <List.Item style={{ padding : '1rem'}} >
                <List.Item.Meta
                    avatar={<Avatar icon={AvatarSrc}/>}
                    title={message.who}
                    description={renderCards(message.content.payload.fields.card.listValue.values)}
                />
                </List.Item>
                </div>
        }


        }
    
    

    const renderMessage = (returnMessages) => {
        if(returnMessages) {
            return returnMessages.map((message, i) => {
                return renderOneMessage(message, i)
            })
        } else {
            return null;
        }
    }

    return (
        <div style={{ height : 700, width : 700, border : '3px solid black', borderRadius : '7px'}}>
            <div style={{ height : 644, width : '100%', overflow : 'auto' }}>
                {renderMessage(messagesFromRdux)}
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
