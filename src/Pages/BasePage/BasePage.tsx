import styles from './BasePage.module.css';
import { Card } from "antd";
import { Typography } from 'antd'

const { Title } = Typography;

interface Props {
    title: string,
    children?: React.ReactNode,
}

const BasePage = (props: Props) => (
    <Card
        title={
            <Title level={2} className={styles.title}>
                {props.title}
            </Title>
        }
        variant='borderless'
        className={styles.card}
    >
        {props.children}
    </Card>
)

export default BasePage;