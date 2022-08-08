import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Badge, Link } from '@chakra-ui/react';
import { ExternalLinkIcon } from '@chakra-ui/icons';
import { listNutanix, fetchNutanixMetaInfos, Nutanix } from '@/api/nutanix';
import { FilterCategories } from '@/api/filters';

import Listing, { ListingColumn, ListingData } from '@/components/Listing';
import useListingSearchParams from '@/hooks/useListingSearchParams';

const getStatusBadgeVariant = (nutanix: Nutanix) => {
  switch (nutanix.status) {
    case 'Active':
      return 'success';
    case 'Deploying':
      return 'warning';
    case 'Error':
      return 'error';
    default:
      return 'infos';
  }
};

export default function ListingPage(): JSX.Element {
  const { t } = useTranslation('nutanix');
  const searchParams = useListingSearchParams();
  const [columns, setColumns] = useState<ListingColumn<Nutanix>[]>([
    {
      key: 'serviceName',
      label: t('cluster_name'),
      filterable: FilterCategories.String,
      search: true,
      hidden: searchParams.isColumnHidden('serviceName'),
      renderer: (nutanix) => (
        <Link as={RouterLink} to={`/nutanix/details/${nutanix.serviceName}`}>
          {nutanix.serviceName}
        </Link>
      ),
    },
    {
      key: 'node_count',
      label: t('node_count'),
      hidden: searchParams.isColumnHidden('node_count'),
      renderer: (nutanix) => <span>{nutanix.targetSpec.nodes.length}</span>,
    },
    {
      key: 'status',
      label: t('status'),
      hidden: searchParams.isColumnHidden('status'),
      renderer: (nutanix) => (
        <Badge variant={getStatusBadgeVariant(nutanix)}>{nutanix.status}</Badge>
      ),
    },
    {
      key: 'location',
      label: t('location'),
      hidden: searchParams.isColumnHidden('location'),
      renderer: (nutanix) =>
        fetchNutanixMetaInfos(nutanix).then(({ region }) => <>{region}</>),
    },
    {
      key: 'admin',
      label: t('administration_interface'),
      hidden: searchParams.isColumnHidden('admin'),
      renderer: (nutanix) => (
        <Link href={nutanix.targetSpec.controlPanelURL} isExternal>
          {t('prism_central_url')}
          <ExternalLinkIcon ml={2} />
        </Link>
      ),
    },
  ]);
  const [services, setServices] = useState<ListingData<Nutanix>>();

  return (
    <Listing
      columns={columns}
      data={services}
      initialState={searchParams.getInitialState()}
      onChange={(state) => {
        const { currentPage, pageSize, sort } = state.table;
        setServices(null);
        searchParams.updateState(state);
        listNutanix({
          currentPage,
          pageSize,
          filters: state.filters,
          sortBy: sort?.key,
          sortReverse: sort?.reverse,
        }).then(({ totalCount, data }) =>
          setServices({
            total: totalCount,
            items: data,
          }),
        );
      }}
      onColumnsChange={(cols) => {
        setColumns(cols);
        searchParams.updateColumns(cols);
      }}
    />
  );
}
