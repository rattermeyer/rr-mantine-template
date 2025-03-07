import type { Route } from "./+types/layout"
import {Title} from '@mantine/core';
import {Outlet} from 'react-router';

export default function CustomersLayout(_: Route.ComponentProps) {
    return (
        <>
            <Title order={1}>Customers</Title>
            <Outlet  />
        </>
    )
}
