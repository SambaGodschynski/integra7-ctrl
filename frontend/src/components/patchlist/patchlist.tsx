import { useEffect, useState } from "react";
import { IPatch } from "../../integra7/patch";
import { getPatches } from "../../common/rest";
import { Table } from 'antd';

const columns = [
    {
        title: 'Nr',
        dataIndex: 'id',
        key: 'id',
    },
    {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
    },
    {
        title: 'Category',
        dataIndex: 'category',
        key: 'category',
    },
    {
        title: 'Type',
        dataIndex: 'type',
        key: 'type',
    },
];

export const Patchlist = function () {
    const [patches, setPatches] = useState<IPatch[]>([])
    const loadPatches = async function (): Promise<void> {
        const response = await getPatches();
        setPatches(response);
    }
    useEffect(() => {
        loadPatches();
    }, [])
    return (<>
        <Table size="small" dataSource={patches} columns={columns} rowKey="id"></Table>
    </>);
}