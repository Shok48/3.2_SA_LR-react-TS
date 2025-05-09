import { useCallback, useMemo, useState, type FC } from "react";
import { Button, Card, Dropdown, Flex, message, Popconfirm, Space, Splitter, Typography, type MenuProps } from 'antd';
import { DeleteOutlined, DownloadOutlined, DownOutlined, UploadOutlined, PlusOutlined } from "@ant-design/icons"
import FieldManager from "./FieldManager";
import type { Graph } from "../../Types/Graph.types";

const { Title, Text } = Typography;

interface IncListInputProps {
    side?: 'right' | 'left',
}

function fromIncList(incList: Record<number, number[]>, side: 'right' | 'left' = 'left'): Graph {
    const nodes = Object.keys(incList).map(Number);
    
    const edges = Object.entries(incList).flatMap(([key, values]) =>
        values.map(value => 
            side === 'left' 
                ? { source: +key, target: value } 
                : { source: value, target: +key }
        )
    );

    return { nodes, edges };
}

const IncListInput: FC<IncListInputProps> = ({ side = 'left' }) => {
    const [fields, setFields] = useState<Record<number, number[]>>({
        1: [2, 3],
        2: [3],
        3: []
    });

    const fieldEntries = useMemo(() => Object.entries(fields), [fields]);

    const graph = useMemo(() => fromIncList(fields, side), [fields, side])

    const handleAddInput = useCallback((id: number) => 
        setFields(prev => ({
            ...prev,
            [id]: [...prev[id], Number(Object.keys(prev)[0])]
        })), []
    );

    const handleAddField = useCallback(() =>
        setFields(prev => ({
            ...prev,
            [Object.keys(prev).length + 1]: []
        })), []
    )

    const handleRemoveInput = useCallback((fid: number, iid: number) => 
        setFields(prev => ({
            ...prev,
            [fid]: prev[fid].filter((_, id) => id !== iid)
        })), []
    );

    const handleRemoveField = useCallback((id: number) => 
        setFields(prev => {
            return Object.fromEntries(
                Object.entries(prev)
                    .filter(([key]) => Number(key) !== id)
                    .map(([, value], index) => [
                        index + 1,
                        value.filter(val => val !== id)
                    ])
            ) as Record<number, number[]>;
        }), []
    );

    const handleChangeInput = useCallback((fid: number, iid: number, value: number) => 
        setFields(prev => ({
            ...prev,
            [fid]: prev[fid].map((item, id) => id === iid ? value : item)
        })), []
    );

    const handleClear = useCallback(() => 
        setFields({1: []}), []
    )

    const handleLoadFromJson = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const content = e.target?.result as string;
                const data = JSON.parse(content) as Record<number, number[]>;

                if (data && typeof data === 'object' && !Array.isArray(data)) {
                    setFields(data);
                    message.success('Множество успешно загружено из файла');
                } else {
                    message.error('Файл не содержит корректных данных множества')
                }
            } catch (error) { 
                message.error('Ошибка чтения файла');
                console.error(error);
            }
        }

        reader.readAsText(file);
        event.target.value = '';
    }, []);

    const handleSaveToJson = useCallback(() => {
        const data: Record<number, number[]> = fields;
        const json = JSON.stringify(data, null, 2);

        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `graph_inclist_${new Date().toISOString().slice(0, 10)}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        message.success('Множество сохранено в файл')
    }, [fields])

    const actionItems: MenuProps['items'] = useMemo(() => [
        {
            key: 'load',
            label: (
                <Flex justify='space-between' gap={10}>
                    Загрузить
                    <input 
                        type="file" 
                        accept=".json" 
                        onChange={handleLoadFromJson}
                        style={{ 
                            position: 'absolute',
                            left: 0,
                            top: 0,
                            width: '100%',
                            height: '100%',
                            opacity: 0,
                            cursor: 'pointer'
                        }}
                    />
                    <UploadOutlined />
                </Flex>
            )
        },
        {
            key: 'save',
            label: (
                <Flex justify="space-between" gap={10}>
                    Сохранить
                    <DownloadOutlined />
                </Flex>
            ),
            onClick: handleSaveToJson
        }
    ], [handleLoadFromJson, handleSaveToJson]);

    const cardExtra = (
        <Space>
            <Popconfirm
                title={`Очистить множество ${side === 'left' ? 'левых' : 'правых'} инцидентов`}
                placement="topRight"
                okText='Да'
                cancelText='Нет'
                onConfirm={handleClear}
            >
                <Button
                    size='small'
                    icon={<DeleteOutlined />}
                    danger
                >
                    Очистить
                </Button>
            </Popconfirm>
            <Dropdown menu={{ items: actionItems }} trigger={['hover']} placement="bottomRight">
                <Button>
                    <Space>
                        <Text>Действие</Text>
                        <DownOutlined />
                    </Space>
                </Button>
            </Dropdown>
        </Space>
    )

    return (
        <Card
            title={<Title level={4}>{`Введите множество ${side === 'left' ? 'левых' : 'правых'}`}</Title>}
            extra={cardExtra}
        >
            <Splitter
                style={{ height: '400px', padding: '0 10px'}}
            >
                <Splitter.Panel min='60%' defaultSize='60%' style={{ height: '100%'}}>
                    <Flex vertical justify="space-between" style={{ height: '100%'}}>
                        <Space direction="vertical" size='small' style={{ overflowX: 'hidden' }}>
                            {
                                fieldEntries.map(([id, inputs]) => (
                                    <FieldManager
                                        key={Number(id)}
                                        fieldId={Number(id)}
                                        inputs={inputs}
                                        onAddInput={handleAddInput}
                                        onRemoveInput={handleRemoveInput}
                                        onRemoveField={handleRemoveField}
                                        onInputChange={handleChangeInput}
                                        allFields={Object.keys(fields).map(Number)}
                                    />
                                ))
                            }
                        </Space>
                        <Button
                            icon={<PlusOutlined />}
                            type="primary"
                            onClick={handleAddField}
                            style={{
                                backgroundColor: '#52c41a',
                                borderColor: '#52c41a',
                                width: '350px',
                                alignSelf: 'center'
                            }}
                        >
                            Добавить поле
                        </Button>
                    </Flex>
                </Splitter.Panel>
                <Splitter.Panel min='40%' defaultSize='40%' collapsible>
                    <pre style={{ 
                        margin: 0, 
                        padding: '8px', 
                        height: '100%',
                        overflowY: 'auto',
                        overflowX: 'hidden'
                    }}>
                        {JSON.stringify(graph.edges, null, 2).slice(2, -2)}
                    </pre>
                    {/* TODO: Добавить визуализацию графа */}
                </Splitter.Panel>
            </Splitter>
        </Card>
    )
}

export default IncListInput;