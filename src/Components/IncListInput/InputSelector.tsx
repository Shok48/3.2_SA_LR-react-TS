import { Button, Select, Space } from "antd";
import { memo, type FC } from "react";
import { MinusOutlined } from '@ant-design/icons';

interface InputSelectorProps {
    fieldId: number,
    inputId: number,
    value: number,
    fieldKeys: number[],
    onRemove: () => void,
    onChange: (fieldId: number, inputId: number, newValue: number) => void,
}

const InputSelector: FC<InputSelectorProps> = memo(({
    fieldId,
    inputId,
    value,
    fieldKeys,
    onRemove,
    onChange,
}) => (
    <Space>
        <Select
            value={value}
            onChange={newValue => onChange(fieldId, inputId, newValue)}
            style={{ width: 80 }}
        >
            {
                fieldKeys.map((fieldKey) => (
                    <Select.Option key={fieldKey} value={fieldKey}>{fieldKey}</Select.Option>
                ))
            }
        </Select>
        <Button
            icon={<MinusOutlined />}
            onClick={onRemove}
            size="small"
            danger
        />
    </Space>
));

export default InputSelector;