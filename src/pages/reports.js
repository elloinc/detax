import { useState, useEffect, useContext } from 'react'
import { Button, createStyles, rem, Text, Group, Stack } from '@mantine/core'
import { Context } from '@/components/Context'
import { IconX } from '@tabler/icons-react'
import { flags, countriesData } from '@/data/countries'

const useStyles = createStyles((theme) => ({
    outer: {
        flex: 1,
        display: 'flex',
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : '#fff',
        borderRadius: theme.radius.sm,
        border: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[2]}`,
        overflow: 'hidden',
        width: '100%',
        height: '100%'
    },
    addressColumn: {
        width: rem(320),
        borderRight: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[2]}`
    },
    countryColumn: {
        width: rem(200),
        borderRight: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[2]}`
    },
    networkColumn: {
        width: rem(200),
        borderRight: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[2]}`
    },
    tokenColumn: {
        flex: 1
    },
    columnHeader: {
        display: 'flex',
        gap: theme.spacing.md,
        justifyContent: 'space-between',
        padding: theme.spacing.md,
        borderBottom: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[2]}`
    },
    columnContent: {
        display: 'flex',
        flexDirection: 'column',
        gap: theme.spacing.sm,
        padding: theme.spacing.md,
        overflowY: 'auto'
    },
    address: {
        width: '100%',
        overflow: 'hidden',
        marginRight: theme.spacing.md,
        textOverflow: 'ellipsis'
    },
    iconHover: {
        '&:hover': {
            scale: '1.2'
        }
    }
}))

export default function Reports() {
    const { classes } = useStyles()
    const { reports, addReport, removeReport } = useContext(Context)
    const [selectedReport, setSelectedReport] = useState(null)

    const countryData = Object.fromEntries(countriesData.map((country) => [country.value, country]))
    const SelectedFlag = flags[selectedReport?.country]

    useEffect(() => {
        setSelectedReport(reports[0] || null)
    }, [reports])

    return (
        <div className={classes.outer}>
            <div className={classes.addressColumn}>
                <div className={classes.columnHeader}>
                    Addresses
                </div>

                <div className={classes.columnContent}>
                    {reports.map((report) => (
                        <Button variant={selectedReport?.address === report.address ? 'light' : 'subtle'} key={report.address}
                                onClick={() => setSelectedReport(report)}>
                            <p className={classes.address}>
                                {report.address}
                            </p>

                            <IconX size={18} className={classes.iconHover} onClick={() => {
                                // setAddresses(addresses.filter((a) => a !== address))
                            }} />
                        </Button>
                    ))}
                </div>
            </div>

            <div className={classes.countryColumn}>
                <div className={classes.columnHeader}>
                    Country
                </div>

                <div className={classes.columnContent}>
                    {selectedReport && (
                        <Group>
                            <SelectedFlag/>

                            <Text>
                                {countryData[selectedReport.country].label}
                            </Text>
                        </Group>
                    )}
                </div>
            </div>

            <div className={classes.networkColumn}>
                <div className={classes.columnHeader}>
                    Networks
                </div>

                <div className={classes.columnContent}>
                    {selectedReport && (
                        <Stack>
                            {selectedReport.networks.map((network) => (
                                <Text key={network.name}>
                                    {network.name}
                                </Text>
                                ))}
                        </Stack>
                    )}
                </div>
            </div>

            <div className={classes.tokenColumn}>
                <div className={classes.columnHeader}>
                    Tokens
                </div>

                <div className={classes.columnContent}>
                    {selectedReport && selectedReport.tokens && (
                        <Stack>
                            {selectedReport.tokens.map((token) => (
                                <Text key={token.symbol}>
                                    {token.symbol}
                                </Text>
                            ))}
                        </Stack>
                    )}
                </div>
            </div>
        </div>
    )
}