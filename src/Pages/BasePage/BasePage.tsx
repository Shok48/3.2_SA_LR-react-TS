import styles from './BasePage.module.css';
import { Card } from "antd";
import { Typography } from 'antd'
import type { ReactNode } from 'react';

const { Title } = Typography;

interface Props {
    title: string,
    children?: ReactNode,
}

const BasePage = (props: Props) => (
    <Card
        title={
            <Title level={2} className={styles.title}>
                {props.title}
            </Title>
        }
        variant='borderless'
        className={styles.page}
    >
        {props.children}
    </Card>
)

export default BasePage;