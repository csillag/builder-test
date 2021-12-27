import * as React from 'react';

import { Company, CompanyQuery } from '/imports/common/data/types';
import { Table, Tag } from 'antd';
import { highlightSearchResult } from '/imports/common/ui-widgets/highlighter';
import { YesNoSwitch } from '/imports/common/ui-widgets/YesNoSwitch';

/**
 * The data we need to render the table
 */
interface ResultTableProps {
    query: CompanyQuery;
    ready: boolean;
    data: Company[];
    onSetCertified: (id: string, value: boolean) => void;
    onHide: (id: string) => void;
}

/**
 * A simple functional React component that renders the table
 *
 * Don't use this directly, since this will "glitch",
 * ie. the data will disappear and re-appear while updating.
 *
 * See ResultsTable bellow.
 */
const RawResultTable = (props: ResultTableProps) => (
    <>
        <Table
            dataSource={props.data.map((c) => ({ ...c, key: c._id }))}
            columns={[
                {
                    title: 'Company name',
                    dataIndex: 'name',
                    width: '30%',
                    render: (name) => (
                        <span
                            dangerouslySetInnerHTML={{
                                __html: highlightSearchResult(name, props.query.namePattern),
                            }}
                        />
                    ),
                },
                {
                    title: 'Logo',
                    dataIndex: 'logo',
                    width: '15%',
                    render: (url) => <img src={url} height={64} />,
                },
                {
                    title: 'City',
                    dataIndex: 'city',
                    width: '15%',
                },
                {
                    title: 'Specialities',
                    dataIndex: 'specialities',
                    width: '30%',
                    render: (specialities: string[]) => (
                        <>
                            {specialities.map((tag) => {
                                let color =
                                    (props.query.requiredSpecialities || []).indexOf(tag) !== -1 ? 'red' : undefined; // "black";
                                return (
                                    <Tag color={color} key={tag}>
                                        {tag.toUpperCase()}
                                    </Tag>
                                );
                            })}
                        </>
                    ),
                },
                {
                    title: 'Certified?',
                    dataIndex: 'certified',
                    width: '5%',
                    render: (value: boolean, data: Company) => (
                        <YesNoSwitch value={value} onChange={(newValue) => props.onSetCertified(data._id, newValue)} />
                    ),
                },
                {
                    title: 'Actions',
                    dataIndex: '_id',
                    key: 'none',
                    width: '5%',
                    render: (id: string) => <a onClick={() => props.onHide(id)}>Hide</a>,
                },
            ]}
        />
        {!!props.data.length && <span>{props.data.length} records found.</span>}
    </>
);

/**
 * A wrapper around our result table that avoids glitching
 *
 * ... which means that when the data is being re-loaded,
 * we don't want it to disappear
 */
export const ResultTable = React.memo(RawResultTable, (_, props) => !props.ready);
