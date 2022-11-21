import React from 'react';
import { Page, List, ListInput, Block, Col, Button } from 'framework7-react';

export default () => (
    <Page name='navigator' >
        <form>
            <List>
                <Block>
                    <Col tag="span">
                        <Button fill>List</Button>
                    </Col>
                </Block>
            </List>
        </form>
    </Page>
)