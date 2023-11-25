import './patchlist.css';
import { IPatch } from "../../integra7/patch";
import { SearchOutlined } from '@ant-design/icons';
import React, { useRef, useState, useEffect, KeyboardEvent } from 'react';
import Highlighter from 'react-highlight-words';
import type { InputRef } from 'antd';
import { Button, Input, Space, Table } from 'antd';
import type { ColumnType } from 'antd/es/table';
import type { FilterConfirmProps, TableCurrentDataSource, TablePaginationConfig } from 'antd/es/table/interface';
import { getIntegra7 } from '../../integra7/communicationServer';


type DataIndex = keyof IPatch;

const MidiChannel = 0; // TODO: make dynamic
const DefaultPageSize = 20;
export const Patchlist = function (props: {onSelect?: (patch:IPatch)=>void}) {
    const [patches, setPatches] = useState<IPatch[]>([])
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const [selectedId, setSelectedId] = useState<number|undefined>(undefined);
    const [page, setPage] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(DefaultPageSize);
    const searchInput = useRef<InputRef>(null);
    const [currentData, setCurrentData] = useState<IPatch[]>([]);

    const handleSearch = (
        selectedKeys: string[],
        confirm: (param?: FilterConfirmProps) => void,
        dataIndex: DataIndex,
    ) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };

    const handleReset = (clearFilters: () => void) => {
        clearFilters();
        setSearchText('');
    };

    const getColumnSearchProps = (dataIndex: DataIndex): ColumnType<IPatch> => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
            <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
                <Input
                    ref={searchInput}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
                    style={{ marginBottom: 8, display: 'block' }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{ width: 90 }}
                    >
                        Search
                    </Button>
                    <Button
                        onClick={() => clearFilters && handleReset(clearFilters)}
                        size="small"
                        style={{ width: 90 }}
                    >
                        Reset
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            confirm({ closeDropdown: false });
                            setSearchText((selectedKeys as string[])[0]);
                            setSearchedColumn(dataIndex);
                        }}
                    >
                        Filter
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            close();
                        }}
                    >
                        close
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered: boolean) => (
            <SearchOutlined style={{ color: filtered ? '#1677ff' : undefined }} />
        ),
        onFilter: (value, record) =>
            record[dataIndex]
                .toString()
                .toLowerCase()
                .includes((value as string).toLowerCase()),
        onFilterDropdownOpenChange: (visible) => {
            if (visible) {
                setTimeout(() => searchInput.current?.select(), 100);
            }
        },
        render: (text) =>
            searchedColumn === dataIndex ? (
                <Highlighter
                    highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
                    searchWords={[searchText]}
                    autoEscape
                    textToHighlight={text ? text.toString() : ''}
                />
            ) : (
                text
            ),
    });
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
            ...getColumnSearchProps('name'),
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
    const loadPatches = async (): Promise<void> => {
        const integra7 = await getIntegra7();
        const response = await integra7.getPatches();
        setCurrentData(response);
        setPatches(response);
    }
    useEffect(() => {
        loadPatches();
    }, [])
    const choosePatch = async (patch: IPatch) => {
        const integra7 = await getIntegra7();
        await integra7.setPatch(MidiChannel, patch.id);
        setSelectedId(patch.id);
        if (props.onSelect) {
            props.onSelect(patch);
        }
    }

    const findPageOfIndex = (index:number): number => {
        const page = Math.floor(index / pageSize) + 1;
        return page;
    }
    const setNextPatch = async () => {
        let currentIndex = currentData.findIndex(x => x.id === selectedId);
        const nextIndex = Math.min((currentIndex ?? 0) + 1, currentData.length - 1);
        const patch = currentData[nextIndex];
        setPage(findPageOfIndex(nextIndex));
        await choosePatch(patch);
    }
    const prevNextPatch = async () => {
        let currentIndex = currentData.findIndex(x => x.id === selectedId);
        const prevIndex = Math.max((currentIndex ?? 0) - 1, 0);
        const patch = currentData[prevIndex];
        setPage(findPageOfIndex(prevIndex));
        await choosePatch(patch);
    }
    const setNextPage = async () => {
        const newPage = Math.min(page + 1, Math.floor(patches.length / pageSize));
        setPage(newPage);
    }
    const setPrevPage = async () => {
        const newPage = Math.max(page - 1, 1);
        setPage(newPage);
    }
    const onKeyPressed = async function(ev: KeyboardEvent) {
        if (ev.key === "ArrowDown") {
            setNextPatch();
            return;
        }
        if (ev.key === "ArrowUp") {
            prevNextPatch();
            return;
        }
        if (ev.key === "PageDown") {
            setNextPage();
            return;
        }
        if (ev.key === "PageUp") {
            setPrevPage();
            return;
        }
    }
    const onChange = (pagination:TablePaginationConfig, _filters:any, _sorter:any, extra:TableCurrentDataSource<IPatch>) => {
        setPage(pagination.current ?? 1);
        setPageSize(pagination.pageSize ?? DefaultPageSize);
        setCurrentData(extra.currentDataSource);
    };
    return (<div className="patchlist" tabIndex={0} onKeyDown={onKeyPressed} >
        <Table size="small"
            onRow={(record, rowIndex) => {
                return {
                    onClick: choosePatch.bind(null, record)
                };
            }}
            onChange={onChange}
            dataSource={patches}
            columns={columns}
            pagination={{ position: ["bottomCenter"], pageSize: pageSize, current: page }}
            rowClassName={(patch) => selectedId === patch.id ? 'selected' : ''}
            rowKey="id"></Table>
    </div>);
}