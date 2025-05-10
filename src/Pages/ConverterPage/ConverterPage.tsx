import { useCallback, useEffect, useMemo, useState } from "react";
import IncListInput from "../../Components/IncListInput/IncListInput";
import BasePage from "../BasePage/BasePage";
import { Space, Table, Tabs, Tag, Tooltip, type TabsProps } from 'antd';
import { type Edge, type Graph } from "../../Types/Graph.types";

interface IDataSource {
    key: string;
    vertex: string;
    [key: string]: string;
}

const ConverterPage = () => {
    const [graph, setGraph] = useState<Graph>({nodes: [], edges: []});

    const abjMatrix: number[][] = useMemo(() => {
        return graph.edges.reduce((acc: number[][], {source, target}) => {
            const sourceId = graph.nodes.indexOf(source);
            const targetId = graph.nodes.indexOf(target);

            if (sourceId !== -1 && targetId !== -1) {
                acc[sourceId][targetId] = 1
            }

            return acc
        }, Array.from({ length: graph.nodes.length }, () => Array(graph.nodes.length).fill(0)));
    }, [graph])

    const incMatrix: number[][] = useMemo(() => 
        graph.edges.reduce((acc: number[][], edge: Edge, index: number) => {
            const { source, target } = edge;

            const sourceIndex = graph.nodes.indexOf(source);
            const targetIndex = graph.nodes.indexOf(target);

            if (sourceIndex !== -1 && targetIndex !== -1) {
                acc[sourceIndex][index] = -1;
                acc[targetIndex][index] = 1;
            }

            return acc
        }, Array.from({ length: graph.nodes.length }, () => Array(graph.edges.length).fill(0))),
        [graph]
    )

    useEffect(() => console.log('Новое значение графа: ', graph), [graph])

    const handleGraphChange = useCallback((newGraph: Graph) => {
        setGraph(newGraph);
    }, [])

    const abjColumns = useMemo(() => [
        {
            title: '',
            dataIndex: 'vertex',
            key: 'vertex',
            fixed: 'left' as const,
            width: 60,
            // render: (text: string) => <Tag color="blue">{text}</Tag>
        },
        ...graph.nodes.map((_, index) => ({
            title: `V${index + 1}`,
            dataIndex: `col${index}`,
            key: `col${index}`,
            width: 60,
            align: 'center' as const,
            render: (value: number, record: IDataSource) => (
                <Tooltip title={value === 1 ? `Дуга: ${record.vertex} → V${index + 1}` : ''}>
                    <Tag color={value === 1 ? 'green' : 'default'}>{value}</Tag>
                </Tooltip>
            )
        }))
    ], [graph])

    const incColumns = useMemo(() => [
        {
            title: '',
            dataIndex: 'vertex',
            key: 'vertex',
            fixed: 'left' as const,
            width: 60
        },
        ...graph.edges.map((_, index) => ({
            title: `E${index + 1}`,
            dataIndex: `col${index}`,
            key: `col${index}`,
            width: 60,
            align: 'center' as const,
            render: (value: number) => (
                <Tooltip title={value === -1 ? `Начало дуги: e${index + 1}` : value === 1 ? `Конец дуги: e${index + 1}` : ''}>
                    <Tag color={value === -1 ? 'red' : value === 1 ? 'green' : 'default'}>{value}</Tag>
                </Tooltip>
            )
        }))
    ], [graph])

    const abjDataSource = useMemo(() => abjMatrix.map((row, rowIndex) => ({
        key: `row-${rowIndex}`,
        vertex: `V${rowIndex + 1}`,
        ...Object.fromEntries(row.map((value, colIndex) => [`col${colIndex}`, value]))
    })), [abjMatrix])

    const incDataSource = useMemo(() => incMatrix.map((row, rowIndex) => ({
        key: `row-${rowIndex}`,
        vertex: `V${rowIndex + 1}`,
        ...Object.fromEntries(row.map((value, colIndex) => [`col${colIndex}`, value]))
    })), [incMatrix])

    const matrixTabs: TabsProps['items'] = [
        {
            key: 'abj',
            label: 'Матрица смежности',
            children: (
                <Table columns={abjColumns} dataSource={abjDataSource} scroll={{ x: 'max-content'}} pagination={false} bordered/>
            )
        },
        {
            key: 'inc',
            label: 'Матрица инциденций',
            children: (
                <Table columns={incColumns} dataSource={incDataSource} scroll={{ x: 'max-content'}} pagination={false} bordered/>
            )
        }
    ]

    return (
        <BasePage 
            title='Конвертер левых инцидентов в матрицы смежности и инцидентности'
        >
            <Space direction="vertical" style={{ width: '100%' }}>
                <IncListInput
                    onGraphChange={handleGraphChange}
                />
                <Tabs
                    defaultActiveKey="1"
                    items={matrixTabs}
                    style={{ background: '#fff', padding: '10px', borderRadius: '8px'}}
                />
            </Space>
        </BasePage>
    )
}

export default ConverterPage;