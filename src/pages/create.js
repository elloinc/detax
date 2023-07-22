import { useState, forwardRef, useContext } from 'react'
import {
    createStyles,
    Container,
    Button,
    Text,
    Title,
    Paper,
    Input,
    Group,
    Checkbox,
    ScrollArea,
    Select,
    Stack,
    Box,
    Flex,
    Collapse,
    Divider,
    rem
} from '@mantine/core'
import {
    IconSquareRoundedChevronLeftFilled,
    IconSquareRoundedChevronRightFilled,
    IconChevronDown
} from '@tabler/icons-react'
import { isAddress } from 'viem'
import { notifications } from '@mantine/notifications'
import { fetchQuery } from '@airstack/airstack-react'
import { countriesData, flags } from '@/data/countries'
import supportedNetworks from '@/data/networks'
import fetchToken from '@/utils/fetchToken'
import fetchTransactions from '@/utils/fetchTransactions'
import { tokensQuery } from '@/utils/queries'
import { Context } from '@/components/Context'

const useStyles = createStyles((theme) => ({
    navigation: {
        display: 'flex',
        justifyContent: 'space-between'
    },
    selectableCheckbox: {
        zIndex: 0,
        display: 'flex',
        alignItems: 'center',
        padding: rem(7),
        borderRadius: theme.radius.md,
        '&:hover': {
            backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0]
        }
    },
    disabled: {
        '&:disabled': {
            backgroundColor: 'transparent'
        }
    },
    unselectable: {
        userSelect: 'none',
        pointerEvents: 'none'
    },
    fullWidthLabel: {
        '& span': {
            width: '100%'
        }
    },
    flexOne: {
        flex: 1
    }
}))

const CheckboxWrapper = ({ key, label, checked, onClick }) => {
    const { classes } = useStyles()

    return (
        <div key={key} className={classes.selectableCheckbox}
             onClick={onClick}
        >
            <Checkbox
                onChange={() => {
                }}
                checked={checked}
                className={classes.unselectable}
                label={label} />
        </div>
    )
}

const TokenCheckbox = ({ key, network, token, tokens, setTokens }) => {
    const [checked, setChecked] = useState(tokens[network.chainId]?.some((item) => item.address === token.address))

    return <CheckboxWrapper
        key={key}
        zIndex={0}
        label={
            <Group spacing={8}>
                <Text>{token.symbol}</Text>
                <Text c='dimmed'>{token.name}</Text>
            </Group>
        }
        checked={checked}
        onClick={() => {
            setChecked(!checked)
            setTokens((prev) => {
                let chainTokens = prev[network.chainId] || []

                if (checked) {
                    chainTokens = chainTokens.filter((item) => item.address !== token.address)
                } else {
                    chainTokens.push(token)
                }

                return { ...prev, [network.chainId]: chainTokens }
            })
        }}
    />
}

const NetworkCheckbox = ({ key, networks, network, setNetworks }) => {
    const [checked, setChecked] = useState(networks.some((item) => item.chainId === network.chainId))

    return <CheckboxWrapper
        key={key}
        label={network.name}
        checked={checked}
        onClick={() => {
            setChecked(!checked)
            setNetworks((prev) => {
                if (checked) {
                    return prev.filter((item) => item.chainId !== network.chainId)
                } else {
                    return [...prev, network]
                }
            })
        }}
    />
}

const TokenSelector = ({ key, network, tokens, setTokens, children, openNetwork, setOpenNetwork }) => {
    const { classes } = useStyles()
    const [selectableTokens, setSelectableTokens] = useState([...network.supportedTokens])
    const [importAddress, setImportAddress] = useState('')

    const addToken = async () => {
        if (!isAddress(importAddress)) {
            return notifications.show({
                title: 'Invalid Address',
                message: 'Please enter a valid address',
                color: 'red'
            })
        }

        const token = await fetchToken(network, importAddress)

        if (token !== null) {
            if (selectableTokens.some((item) => item.address === token.address)) {
                return notifications.show({
                    title: 'Token Already Added',
                    message: 'This token is already added to the list',
                    color: 'red'
                })
            } else {
                setSelectableTokens((prev) => [...prev, token])
            }
            setImportAddress('')
        } else {
            notifications.show({
                title: 'Invalid Address',
                message: 'Please enter a valid ERC20 Token Address',
                color: 'red'
            })
        }
    }

    const toggleDrawer = () => {
        if (openNetwork !== network.chainId) {
            setOpenNetwork(network.chainId)
        } else {
            setOpenNetwork(null)
        }
    }

    return (
        <Box key={key}>
            <Group position='center' mb={5}>
                <Button onClick={toggleDrawer}
                        variant='light'
                        className={classes.fullWidthLabel}
                        fullWidth={true}>
                    <Group style={{ width: '100%' }} position='apart'>
                        {children}
                    </Group>
                </Button>
            </Group>

            <Collapse in={openNetwork === network.chainId} mb='sm'>
                <Flex direction='column'>
                    {selectableTokens && selectableTokens.map((token) => (
                        <TokenCheckbox key={token.address}
                                       token={token}
                                       tokens={tokens}
                                       setTokens={setTokens}
                                       network={network} />
                    ))}
                </Flex>

                {selectableTokens && <Divider size='xs' opacity={0.5} />}

                <Group position='apart' mt='sm'>
                    <Input
                        label='Import Token'
                        className={classes.flexOne}
                        value={importAddress}
                        onKeyDown={async (event) =>
                            event.key === 'Enter' && await addToken()
                        }
                        onChange={(event) => setImportAddress(event.currentTarget.value)}
                        placeholder='0x0000000000000000000000000000000000000000'
                    />

                    <Button variant='light' onClick={addToken}>
                        Import
                    </Button>
                </Group>
            </Collapse>
        </Box>
    )
}

// eslint-disable-next-line react/display-name
const CountryItem = forwardRef(
    ({ label, value, ...others }, ref) => {
        const Flag = flags[value]

        return (
            <div ref={ref} {...others}>
                <Group position='start'>
                    <Flag />
                    <Text>{label}</Text>
                </Group>
            </div>
        )
    }
)


export default function Create() {
    const { classes } = useStyles()
    const { addReport } = useContext(Context)
    const [step, setStep] = useState(0)
    const [loading, setLoading] = useState(false)
    const [country, setCountry] = useState(null)
    const [address, setAddress] = useState('')
    const [networks, setNetworks] = useState([])
    const [openNetwork, setOpenNetwork] = useState(null)
    const [tokens, setTokens] = useState({})

    const createReport = async () => {
        setLoading(true)
        const transactions = {}

        for (const network of networks) {
            if (network.chainId === 1) {
                const { data, error } = await fetchQuery(tokensQuery, {
                    address: address,
                    tokens: tokens[1].map((item) => item.address)
                })

                if (error) {
                    setLoading(false)
                    return notifications.show({
                        title: 'Error',
                        message: 'An error occurred while generating the report'
                    })
                } else {
                    transactions[network.chainId] = data['ethereumTransfers']['TokenTransfer'] || []
                }
            } else {
                transactions[network.chainId] = await fetchTransactions(network.chainId, address, tokens[network.chainId])
            }
        }

        const response = await fetch('/api/generate_pdf', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                transactions: transactions,
                tokens: tokens,
                address: address
            })
        })

        if (response.status === 200) {
            const buffer = await response.blob()

            // Create blob link to download
            const url = window.webkitURL.createObjectURL(
                new Blob([buffer], { type: 'application/pdf' })
            )

            const link = document.createElement('a')
            link.href = url
            link.setAttribute(
                'download',
                `report.pdf`
            )

            // Append to html link element page
            document.body.appendChild(link)

            // Start download
            link.click()

            // Clean up and remove the link
            link.parentNode.removeChild(link)

            addReport({
                address: address,
                country: country,
                networks: networks,
                tokens: tokens[1]
            })

            setLoading(false)
        }

        setLoading(false)
    }

    const stepBack = () => {
        if (step > 0) {
            setStep(step - 1)
        }
    }

    const validateStep = () => {
        if (step === 0) {
            if (country === null) {
                return notifications.show({
                    title: 'No country selected',
                    message: 'Please select a country',
                    color: 'red'
                })
            }

            setStep(1)
        } else if (step === 1) {
            if (!isAddress(address)) {
                notifications.show({
                    title: 'Invalid address',
                    message: 'Please enter a valid address',
                    color: 'red'
                })
            } else {
                setStep(2)
            }
        } else if (step === 2) {
            if (networks.length === 0) {
                notifications.show({
                    title: 'No networks selected',
                    message: 'Please select at least one network',
                    color: 'red'
                })
            } else {
                setStep(3)
            }
        } else if (step === 3) {
            const totalTokens = Object.values(tokens).map((item) => item.length).reduce((a, b) => a + b, 0)

            if (totalTokens === 0) {
                notifications.show({
                    title: 'No tokens selected',
                    message: 'Please select at least one token',
                    color: 'red'
                })
            } else {
                setStep(4)
            }
        } else if (step === 4) {

        }
    }

    const getStep = () => {
        if (step === 0) {
            return (
                <>
                    <Title order={2} mb='sm'>
                        1. Select your country
                    </Title>

                    <Text c='dimmed' mb='sm'>
                        Initiate the process by specifying your country of residence.
                        This step is crucial as tax regulations vary widely by jurisdiction.
                        Knowing your location allows DeTax to tailor its service according to your
                        local tax laws and provide the most accurate tax report possible.
                    </Text>

                    <Select
                        placeholder='Select'
                        itemComponent={CountryItem}
                        clearable
                        value={country}
                        onChange={(value) => setCountry(value)}
                        data={countriesData}
                    />
                </>
            )
        } else if (step === 1) {
            return (
                <>
                    <Title order={2} mb='sm'>
                        2. The address
                    </Title>

                    <Text c='dimmed' mb='sm'>
                        Proceed by entering the address for which
                        you want to generate a tax report. This is typically the public address
                        of your crypto wallet. By inputting this, DeTax can pinpoint your specific
                        transaction history and gather the relevant data.</Text>

                    <Input
                        placeholder='0x0000000000000000000000000000000000000000'
                        width='100%'
                        value={address}
                        onKeyDown={(event) => {
                            if (event.key === 'Enter') {
                                validateStep()
                            }
                        }}
                        onChange={(event) => setAddress(event.currentTarget.value)}
                    />
                </>
            )
        } else if (step === 2) {
            return (
                <>
                    <Title order={2} mb='sm'>
                        3. Select your networks
                    </Title>

                    <Text c='dimmed' mb='sm'>
                        Select the networks you want included in the report. Each blockchain network
                        (like Ethereum, Polygon, etc.) handles transactions independently, and you may
                        have different tokens across them. Select all pertinent networks to ensure your
                        report is comprehensive. </Text>

                    <ScrollArea h={320}>
                        {supportedNetworks.map((network) => (
                            <NetworkCheckbox key={network.chainId}
                                             network={network}
                                             networks={networks}
                                             setNetworks={setNetworks} />
                        ))}
                    </ScrollArea>
                </>
            )
        } else if (step === 3) {
            return (
                <>
                    <Title order={2}>
                        4. Select your Tokens
                    </Title>

                    <Text c='dimmed'>
                        Specify which tokens you want to include in your tax report. Native tokens (the primary currency
                        of each network, such as ETH for Ethereum) are automatically
                        included, but you can manually add any other tokens you hold. This way, DeTax ensures your
                        report is both accurate and customized to your needs. </Text>

                    <ScrollArea h={320} mt='sm'>
                        <div>
                            {networks.map((network) => (
                                <TokenSelector key={network.chainId}
                                               network={network}
                                               tokens={tokens}
                                               setTokens={setTokens}
                                               openNetwork={openNetwork}
                                               setOpenNetwork={setOpenNetwork}>
                                    {network.name}
                                    <IconChevronDown size={18} />
                                </TokenSelector>
                            ))}
                        </div>
                    </ScrollArea>
                </>
            )
        } else if (step === 4) {
            return (
                <Stack spacing='sm'>
                    <Button variant='light' size='lg'
                            loading={loading}
                            onClick={createReport}>
                        Create Report
                    </Button>

                    <Button variant='light' size='lg' disabled>
                        Add another address
                    </Button>
                </Stack>
            )
        }
    }

    return (
        <Container size='xs' style={{ width: '100%' }}>
            <Paper p='sm' withBorder={true}>
                {getStep()}
            </Paper>

            <Group mt='sm' position='apart'>
                <Button variant='subtle' onClick={stepBack} className={classes.disabled}
                        disabled={step === 0 || loading}>
                    <IconSquareRoundedChevronLeftFilled />
                    <Text ml={6}>
                        Back
                    </Text>
                </Button>

                <Button variant='subtle' onClick={validateStep} className={classes.disabled}
                        disabled={step === 4 || loading}>
                    <Text mr={6}>
                        Continue
                    </Text>
                    <IconSquareRoundedChevronRightFilled />
                </Button>
            </Group>
        </Container>
    )
}