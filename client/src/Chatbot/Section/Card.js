import React from 'react'
import { Card, Icon} from 'antd';

const { Meta } = Card;

function Card() {
    return (
        <Card
            style={{ width : 300}}
            cover={
                <img
                alt
                src />
            }
            actions={[
                <a target="_blank" rel="nooper noreferrer" href>
                    <Icon type="ellipsis" key="ellipsis" />
                </a>
            ]}>
                <Meta
                    title
                    description
                />
            </Card>
            }
    )
}

export default Card
