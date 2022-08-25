export const DESCRIPTION_MAX = 50;
export const NAME_PATTERN = /^[a-z0-9_-]+$/i;
export const SIZE_MIN = 10;

const PREFIX_TRACKING_DASHBOARD_NASHA_PARTITION =
  'dashboard::nasha-partitions::';

const PREFIX_TRACKING_PARTITION_DASHBOARD = 'partition::dashboard::';

export const PREFIX_TRACKING_DASHBOARD_PARTITION_CREATE = `${PREFIX_TRACKING_DASHBOARD_NASHA_PARTITION}create`;

export const PREFIX_TRACKING_DASHBOARD_PARTITION_DELETE = `${PREFIX_TRACKING_DASHBOARD_NASHA_PARTITION}delete`;

export const PREFIX_TRACKING_DASHBOARD_PARTITION_UPDATE_SIZE = `${PREFIX_TRACKING_PARTITION_DASHBOARD}edit-size`;

export const PREFIX_TRACKING_DASHBOARD_PARTITION_UPDATE_DESCRIPTION = `${PREFIX_TRACKING_PARTITION_DASHBOARD}edit-description`;

export const PREFIX_TRACKING_DASHBOARD_PARTITION_ZFS_OPTION = `${PREFIX_TRACKING_DASHBOARD_NASHA_PARTITION}zfs-options`;

export const PREFIX_TRACKING_PARTITION_ACL = 'partition::acl';

export const PREFIX_TRACKING_SNAPSHOT_POLICY = 'partition::snapshot-policy';

export default {
  DESCRIPTION_MAX,
  NAME_PATTERN,
  SIZE_MIN,
  PREFIX_TRACKING_DASHBOARD_PARTITION_CREATE,
  PREFIX_TRACKING_DASHBOARD_PARTITION_DELETE,
  PREFIX_TRACKING_DASHBOARD_PARTITION_UPDATE_SIZE,
  PREFIX_TRACKING_DASHBOARD_PARTITION_UPDATE_DESCRIPTION,
  PREFIX_TRACKING_DASHBOARD_PARTITION_ZFS_OPTION,
  PREFIX_TRACKING_PARTITION_ACL,
  PREFIX_TRACKING_SNAPSHOT_POLICY,
};
