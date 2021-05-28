import React from 'react';
import clsx from 'clsx';
import { createStyles, lighten, makeStyles, Theme } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import FilterListIcon from '@material-ui/icons/FilterList';
import { ClearAllRounded } from '@material-ui/icons';
import { withStyles } from '@material-ui/core/styles';

type SelectionMode = "multiple" | "single"| "none"

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

type Order = 'asc' | 'desc';

function getComparator<Key extends keyof any & string>(
    order: Order,
    orderBy: Key,
    descCompare?: (a: any, b:any) => 0|1|-1
): (a: any, b: any) => number {
    return order === 'desc'
        ? (a, b) => (descCompare ? descCompare(a[orderBy], b[orderBy]) : descendingComparator(a, b, orderBy))
        : (a, b) => -(descCompare ? descCompare(a[orderBy], b[orderBy]) : descendingComparator(a, b, orderBy));
}

function stableSort<T>(array: T[], comparator: (a: T, b: T) => number) {
    const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
}

interface ColumnType<T> {
    id: keyof T & string;
    disablePadding: boolean;
    label: string;
    numeric: boolean;
    disableSorting?: boolean;
    renderColumn?: (row: T) => any;
    align: "center" | "right" | "left";
    descendingComparator?: (a: any, b:any) => 0|1|-1
}

interface EnhancedTableProps<T> {
    classes: ReturnType<typeof useStyles>;
    numSelected: number;
    onRequestSort: (event: React.MouseEvent<unknown>, property: keyof T & string) => void;
    onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
    order: Order;
    orderBy: string | undefined;
    rowCount: number;
    selectionMode: SelectionMode;
    columns: ColumnType<T>[];
}
const StyledTableSortLabel = withStyles((theme: Theme) =>
createStyles({
    root: {
      color: 'black',
      "&:hover": {
        color: 'black',
      },
      '&$active': {
        color: 'black',
      },
    },
    active: {},
    icon: {
      color: 'inherit !important'
    },
  })
)(TableSortLabel)

const useHeaderStyles = makeStyles((theme: Theme) =>
    createStyles({
        headCell: {
            fondWeight: "bolder",
            fontSize: "20"
            // backgroundColor: theme.palette.primary.dark,
            // color: theme.palette.common.black
        }
    }),
);

function EnhancedTableHead<T>(props: EnhancedTableProps<T>) {
    const { classes, onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort, selectionMode, columns } = props;
    const createSortHandler = (property: keyof T & string) => (event: React.MouseEvent<unknown>) => {
        onRequestSort(event, property);
    };

    const styles = useHeaderStyles()

    return (
        <TableHead>
            <TableRow>
                {selectionMode === "multiple" && <TableCell padding="checkbox" 
                        className={styles.headCell}>
                    <Checkbox
                        className={styles.headCell}
                        indeterminate={numSelected > 0 && numSelected < rowCount}
                        checked={rowCount > 0 && numSelected === rowCount}
                        onChange={onSelectAllClick}
                        inputProps={{ 'aria-label': 'select all desserts' }}
                    />
                </TableCell>}
                {columns.map((column) => (
                    <TableCell
                        className={styles.headCell}
                        key={column.id as string}
                        align={column.align}
                        padding={column.disablePadding ? 'none' : 'default'}
                        sortDirection={orderBy === column.id ? order : false}
                    >
                        {
                            column.disableSorting
                                ? column.label
                                : <TableSortLabel
                                    active={orderBy === column.id}
                                    direction={orderBy === column.id ? order : 'asc'}
                                    onClick={createSortHandler(column.id)}
                                >
                                    {column.label}
                                    {orderBy === column.id ? (
                                        <span className={classes.visuallyHidden}>
                                            {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                        </span>
                                    ) : null}
                                </TableSortLabel>
                        }
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}

const useToolbarStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            paddingLeft: theme.spacing(2),
            paddingRight: theme.spacing(1),
        },
        highlight:
            theme.palette.type === 'light'
                ? {
                    color: theme.palette.secondary.main,
                    backgroundColor: lighten(theme.palette.secondary.light, 0.85),
                }
                : {
                    color: theme.palette.text.primary,
                    backgroundColor: theme.palette.secondary.dark,
                },
        title: {
            flex: '1 1 100%',
        },
    }),
);

interface ToolbarSelectionActionInt<T> {
    renderIcon: (selectedRows: T[]) => any,
    disabled: (selectedRows: T[]) => any,
    toolTipText: (selectedRows: T[]) => string,
    onClick: (selectedRows: T[]) => any
}

interface EnhancedTableToolbarProps<T> {
    selectedRows: T[];
    headerTitle?: string;
    selectionActions?: ToolbarSelectionActionInt<T>[];
    clearSortingAndFilter: () => any
}

const EnhancedTableToolbar = <T extends unknown>(props: EnhancedTableToolbarProps<T>) => {
    const classes = useToolbarStyles();
    const { selectedRows, headerTitle, clearSortingAndFilter } = props;
    const numSelected = selectedRows.length
    const selectionActions = props.selectionActions ? props.selectionActions : []
    return (
        <Toolbar
            className={clsx(classes.root, {
                [classes.highlight]: numSelected > 0,
            })}
        >
            {numSelected > 0 ? (
                <Typography className={classes.title} color="inherit" variant="subtitle1" component="div">
                    {numSelected} selected
                </Typography>
            ) : (
                <Typography className={classes.title} variant="h6" id="tableTitle" component="div">
                    {headerTitle ? headerTitle : ""}
                </Typography>
            )}
            {numSelected > 0 ? selectionActions.map((action, i) =>
                <Tooltip title={action.toolTipText(selectedRows)} key={i + 1}>
                    <IconButton aria-label={action.toolTipText(selectedRows)} disabled={action.disabled(selectedRows)} onClick={() => action.onClick(selectedRows)}>
                        {action.renderIcon(selectedRows)}
                    </IconButton>
                </Tooltip>
            ) : (
                <React.Fragment>
                    <Tooltip title="Clear Filter and Sorting">
                        <IconButton aria-label="clear list" onClick={() => clearSortingAndFilter()}>
                            <ClearAllRounded />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Filter list">
                        <IconButton aria-label="filter list">
                            <FilterListIcon />
                        </IconButton>
                    </Tooltip>
                </React.Fragment>
            )}
        </Toolbar>
    );
};

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            width: '100%',
        },
        paper: {
            width: '100%',
            marginBottom: theme.spacing(2),
        },
        table: {
            minWidth: 750,
        },
        visuallyHidden: {
            border: 0,
            clip: 'rect(0 0 0 0)',
            height: 1,
            margin: -1,
            overflow: 'hidden',
            padding: 0,
            position: 'absolute',
            top: 20,
            width: 1,
        },
    }),
);

interface EnhancedTablePropsInt<T> {
    selection: {
        mode: SelectionMode
        by: "row" | "checkbox",
        actions?: ToolbarSelectionActionInt<T>[]
    },
    headerTitle?: string
    getRowKey: (row: T) => string
    getRowStyle?: (row: T) => any
    data: T[],
    sorting: {
        defaultSorting?: keyof T & string,
        defaultSortingOrder: Order
    }
    columns: ColumnType<T>[],
    style?: any
    fixedTopRowKey?: string
}

export default function EnhancedTable<T>(props: EnhancedTablePropsInt<T>) {
    const classes = useStyles();
    const { selection, headerTitle, data, sorting, columns, getRowKey, getRowStyle, style, fixedTopRowKey } = props;
    const [order, setOrder] = React.useState<Order>(sorting.defaultSortingOrder);
    const [orderBy, setOrderBy] = React.useState<keyof T & string>();
    const [selected, setSelected] = React.useState<T[]>([]);
    const [page, setPage] = React.useState(0);
    const [dense, setDense] = React.useState(false);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);

    React.useEffect(() => {
        if (selected.length) {
            setSelected([])
        }
    }, [sorting.defaultSorting])

    React.useEffect(() => {
        if (sorting.defaultSorting) {
            setOrderBy(sorting.defaultSorting)
        }
        setSelected([])
    }, [data])

    const handleRequestSort = (event: React.MouseEvent<unknown>, property: keyof T & string) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (selection.mode === "multiple") {
            if (event.target.checked) {
                const newSelecteds = filteredRows;
                setSelected(newSelecteds);
                return;
            }
            setSelected([]);
        }
    };

    const handleClick = (event: React.MouseEvent<unknown>, key: string) => {
        const selectedIndex = selected.findIndex(r => getRowKey(r) === key);
        const selectedRow = filteredRows.find(r => getRowKey(r) === key)
        let newSelected: T[] = [];
        if (selectedRow) {
            if (selectedIndex === -1) {
                if (selection.mode === "multiple") {
                    newSelected = newSelected.concat(selected, selectedRow);
                } else {
                    newSelected.push(selectedRow)
                }
            } else if (selection.mode === "multiple") {
                if (selectedIndex === 0) {
                    newSelected = newSelected.concat(selected.slice(1));
                } else if (selectedIndex === selected.length - 1) {
                    newSelected = newSelected.concat(selected.slice(0, -1));
                } else if (selectedIndex > 0) {
                    newSelected = newSelected.concat(
                        selected.slice(0, selectedIndex),
                        selected.slice(selectedIndex + 1),
                    );
                }
            }
            setSelected(newSelected);
        }
    };

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleChangeDense = (event: React.ChangeEvent<HTMLInputElement>) => {
        setDense(event.target.checked);
    };

    const isSelected = (rowKey: string) => selected.findIndex(r => getRowKey(r) === rowKey) !== -1;

    let filteredRows = data;
    if (orderBy) {
        filteredRows = stableSort(filteredRows, getComparator(order, orderBy, columns.find(r => r.id === orderBy)?.descendingComparator))
    }
    if(fixedTopRowKey) {
        const theRow = filteredRows.find(r => getRowKey(r) === fixedTopRowKey);
        if(theRow) {
            filteredRows = [theRow, ...filteredRows.filter(r => getRowKey(r) !== fixedTopRowKey)]
        }
    }
    const emptyRows = rowsPerPage - Math.min(rowsPerPage, filteredRows.length - page * rowsPerPage);

    return (
        <div className={classes.root}>
            <Paper className={classes.paper} style={style} elevation={3}>
                <EnhancedTableToolbar
                    selectedRows={selected}
                    headerTitle={headerTitle}
                    selectionActions={selection.actions}
                    clearSortingAndFilter={() => orderBy && setOrderBy(undefined)} />
                <TableContainer>
                    <Table
                        className={classes.table}
                        aria-labelledby="tableTitle"
                        size={dense ? 'small' : 'medium'}
                        aria-label="enhanced table"
                    >
                        <EnhancedTableHead
                            classes={classes}
                            numSelected={selected.length}
                            order={order}
                            orderBy={orderBy}
                            onSelectAllClick={handleSelectAllClick}
                            onRequestSort={handleRequestSort}
                            rowCount={filteredRows.length}
                            columns={columns}
                            selectionMode={selection.mode}
                        />
                        <TableBody>
                            {filteredRows
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((row, index) => {
                                    const isItemSelected = isSelected(getRowKey(row));
                                    const labelId = `enhanced-table-checkbox-${index}`;

                                    return (
                                        <TableRow
                                            style={getRowStyle ? getRowStyle(row): undefined}
                                            hover
                                            onClick={(selection.mode !== "none" && selection.by === "row")? (event) => handleClick(event, getRowKey(row)) : undefined}
                                            role="checkbox"
                                            aria-checked={isItemSelected}
                                            tabIndex={-1}
                                            key={getRowKey(row)}
                                            selected={isItemSelected}
                                        >
                                            {selection.mode !== "none" && <TableCell padding="checkbox">
                                                <Checkbox
                                                    checked={isItemSelected}
                                                    onClick={selection.by === "checkbox" ? (event) => handleClick(event, getRowKey(row)) : undefined}
                                                    inputProps={{ 'aria-labelledby': labelId }}
                                                />
                                            </TableCell>}
                                            {
                                                columns.map((column => <TableCell key={column.id} align={column.align}>
                                                    {column.renderColumn ? column.renderColumn(row) : row[column.id]}
                                                </TableCell>))
                                            }
                                        </TableRow>
                                    );
                                })}
                            {emptyRows > 0 && (
                                <TableRow style={{ height: (dense ? 33 : 53) * emptyRows }}>
                                    <TableCell colSpan={6} />
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={filteredRows.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onChangePage={handleChangePage}
                    onChangeRowsPerPage={handleChangeRowsPerPage}
                />
            </Paper>
            <FormControlLabel
                control={<Switch checked={dense} onChange={handleChangeDense} />}
                label="Dense padding"
            />
        </div>
    );
}
