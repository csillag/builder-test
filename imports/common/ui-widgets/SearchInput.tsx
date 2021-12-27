import * as React from 'react';
import { Checkbox, Col, Input, Row, Spin } from 'antd';
import { ALL_SPECIALITIES } from '/imports/common/data/types';

interface SearchInputProps {
    namePattern: string;
    setNamePattern: (value: string) => void;
    ready: boolean;
    requiredSpecialities: string[];
    setRequiredSpecialities: (values: string[]) => void;
}

export const SearchInput = (props: SearchInputProps) => (
    <>
        <Row>
            <Col span={4}>Filter by name:</Col>
            <Col>
                <Input.Search
                    placeholder="Search in company name"
                    value={props.namePattern}
                    onChange={(event) => props.setNamePattern(event.target.value)}
                    style={{ width: 200 }}
                />
                {!props.ready && <Spin />}
            </Col>
        </Row>
        <Row>
            <Col span={4}>Filter by required specialities:</Col>
            <Col>
                <Checkbox.Group
                    options={ALL_SPECIALITIES.sort()}
                    value={props.requiredSpecialities}
                    onChange={props.setRequiredSpecialities as any}
                />
            </Col>
        </Row>
    </>
);
