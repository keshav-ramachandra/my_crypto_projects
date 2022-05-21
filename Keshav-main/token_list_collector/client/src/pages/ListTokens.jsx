import React, { Component } from 'react'
import ReactTable from 'react-table'
import api from '../api'
import { Input } from "semantic-ui-react";
import styled from 'styled-components'

import 'react-table/react-table.css'

const Wrapper = styled.div`
    padding: 100px 40px 40px 40px;
`

class ListTokens extends Component {
    constructor(props) {
        super(props)
        this.state = {
            tokens: [],
            filteredTokens:[],
            columns: [],
            isLoading: false,
            searchInput: ""
        }
    }

    componentDidMount = async () => {
        this.setState({ isLoading: true })

        await api.getAllTokens().then(tokens => {
            this.setState({
                tokens: tokens.data,
                isLoading: false,
            })
        })
    }

    globalSearch = () => {
        let { searchInput, tokens } = this.state;
        console.log("tokens ar now", tokens)
        let filteredTokens = tokens.filter(token => {
        return (
            token.name.toLowerCase().includes(searchInput.toLowerCase())
          );
        });
        this.setState({ filteredTokens });
    };

    
    handleChange = event => {
        this.setState({ searchInput: event.target.value }, () => {
          this.globalSearch();
        });
    };

    render() {
        const { tokens, isLoading, searchInput, filteredTokens  } = this.state

        const columns = [
            {
                Header: 'Name',
                accessor: 'name',
                filterable: false,
                Cell: row => <div style={{ textAlign: "center" }}>{row.value}</div>
            },
            {
                Header: 'Symbol',
                accessor: 'symbol',
                filterable: false,
                Cell: row => <div style={{ textAlign: "center" }}>{row.value}</div>
            },
        ]

        let showTable = true
        if (!tokens.length) {
            showTable = false
        }

        return (


            <Wrapper>
                <div>Token Count: {tokens.length}</div>
                <br />
                <br />
                <Input
                size="large"
                name="searchInput"
                value={searchInput || ""}
                onChange={this.handleChange}
                label="Search"
                placeholder="Search Token by Name"
                />
                <br />
                <br />

                {showTable && (
                    <ReactTable
                        data={filteredTokens && filteredTokens.length ? filteredTokens : tokens}
                        columns={columns}
                        loading={isLoading}
                        defaultPageSize={10}
                        showPageSizeOptions={false}
                        minRows={0}
                    />
                )}
            </Wrapper>
        )
    }
}

export default ListTokens