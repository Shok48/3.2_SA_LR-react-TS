import { Button, Popconfirm, Space } from "antd";
import { memo, type FC } from "react";
import InputSelector from "./InputSelector";
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';


interface FieldManagerProps {
    fieldId: number,
    inputs: number[],
    onAddInput: (fieldId: number) => void,
    onRemoveField: (fieldId: number) => void,
    onRemoveInput: (fieldId: number, inputId: number) => void,
    onInputChange: (fieldId: number, inputId: number, newValue: number) => void,
    allFields: number[],
}

const FieldManager: FC<FieldManagerProps> = memo(({
    fieldId,
    inputs,
    onAddInput,
    onRemoveInput,
    onRemoveField,
    onInputChange,
    allFields,
}) => (
    <Space style={{
        // margin: '10px 0',
        minHeight: '32px',
        display: 'flex',
        flexWrap: 'wrap',
    }}>
        <span>{fieldId}: &#123;</span>
        {
            inputs.map((input, index) => (
                <InputSelector
                    key={`${fieldId}-${index}`}
                    fieldId={fieldId}
                    inputId={index}
                    value={input}
                    fieldKeys={allFields}
                    onRemove={() => onRemoveInput(fieldId, index)}
                    onChange={onInputChange}
                />
            ))
        }
        <Button
            style={{
                backgroundColor: '#52c41a',
                borderColor: '#52c41a'
            }}
            icon={<PlusOutlined />}
            onClick={() => onAddInput(fieldId)}
            type="primary"
            size="small"
        />
        <span>&#125;</span>
        <Popconfirm
            title={`Удалить вершину ${fieldId}?`}
            okText='Да'
            cancelText='Нет'
            disabled={allFields.length <= 1}
            onConfirm={() => onRemoveField(fieldId)}
        >
            <Button
                icon={<DeleteOutlined />}
                size="small"
                danger
            />
        </Popconfirm>
    </Space>
))

export default FieldManager;