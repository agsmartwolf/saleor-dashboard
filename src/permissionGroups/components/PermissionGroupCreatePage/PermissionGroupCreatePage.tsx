import AccountPermissions from "@dashboard/components/AccountPermissions";
import { TopNav } from "@dashboard/components/AppLayout/TopNav";
import { Backlink } from "@dashboard/components/Backlink";
import { ChannelPermission } from "@dashboard/components/ChannelPermission";
import Form from "@dashboard/components/Form";
import { DetailPageLayout } from "@dashboard/components/Layouts";
import Savebar from "@dashboard/components/Savebar";
import {
  ChannelFragment,
  PermissionEnum,
  PermissionGroupErrorFragment,
} from "@dashboard/graphql";
import { SubmitPromise } from "@dashboard/hooks/useForm";
import useNavigator from "@dashboard/hooks/useNavigator";
import { sectionNames } from "@dashboard/intl";
import { permissionGroupListUrl } from "@dashboard/permissionGroups/urls";
import { getFormErrors } from "@dashboard/utils/errors";
import getPermissionGroupErrorMessage from "@dashboard/utils/errors/permissionGroups";
import { ConfirmButtonTransitionState } from "@saleor/macaw-ui";
import { Box } from "@saleor/macaw-ui/next";
import React from "react";
import { useIntl } from "react-intl";

import { PermissionData } from "../PermissionGroupDetailsPage";
import PermissionGroupInfo from "../PermissionGroupInfo";

export interface PermissionGroupCreateFormData {
  name: string;
  hasFullAccess: boolean;
  hasAllChannels: boolean;
  isActive: boolean;
  permissions: PermissionEnum[];
  channels: ChannelFragment[];
}

const initialForm: PermissionGroupCreateFormData = {
  hasFullAccess: false,
  hasAllChannels: false,
  isActive: false,
  name: "",
  permissions: [],
  channels: [],
};

export interface PermissionGroupCreatePageProps {
  disabled: boolean;
  errors: PermissionGroupErrorFragment[];
  permissions: PermissionData[];
  channels: ChannelFragment[];
  saveButtonBarState: ConfirmButtonTransitionState;
  onSubmit: (data: PermissionGroupCreateFormData) => SubmitPromise;
}

const PermissionGroupCreatePage: React.FC<PermissionGroupCreatePageProps> = ({
  disabled,
  permissions,
  channels,
  onSubmit,
  saveButtonBarState,
  errors,
}) => {
  const intl = useIntl();
  const navigate = useNavigator();

  const formErrors = getFormErrors(["addPermissions"], errors || []);
  const permissionsError = getPermissionGroupErrorMessage(
    formErrors.addPermissions,
    intl,
  );

  return (
    <Form
      confirmLeave
      initial={initialForm}
      onSubmit={onSubmit}
      disabled={disabled}
    >
      {({ data, change, submit, isSaveDisabled }) => (
        <DetailPageLayout>
          <TopNav title="New Permission Group" />
          <DetailPageLayout.Content>
            <Backlink href={permissionGroupListUrl()}>
              {intl.formatMessage(sectionNames.permissionGroups)}
            </Backlink>
            <PermissionGroupInfo
              data={data}
              errors={errors}
              onChange={change}
              disabled={disabled}
            />
          </DetailPageLayout.Content>
          <DetailPageLayout.RightSidebar>
            <Box display="grid" __gridTemplateRows="50%  50%" height="100vh">
              <AccountPermissions
                permissionsExceeded={false}
                data={data}
                errorMessage={permissionsError}
                disabled={disabled}
                permissions={permissions}
                onChange={change}
                fullAccessLabel={intl.formatMessage({
                  id: "mAabef",
                  defaultMessage: "Group has full access to the store",
                  description: "checkbox label",
                })}
                description={intl.formatMessage({
                  id: "CYZse9",
                  defaultMessage:
                    "Expand or restrict group's permissions to access certain part of saleor system.",
                  description: "card description",
                })}
              />
              <ChannelPermission
                description="Expand or restrict channels permissions"
                fullAccessLabel="Group has full access to all channels"
                channels={channels}
                onChange={change}
                disabled={disabled}
                data={data}
              />
            </Box>
          </DetailPageLayout.RightSidebar>
          <Savebar
            onCancel={() => navigate(permissionGroupListUrl())}
            onSubmit={submit}
            state={saveButtonBarState}
            disabled={isSaveDisabled}
          />
        </DetailPageLayout>
      )}
    </Form>
  );
};
PermissionGroupCreatePage.displayName = "PermissionGroupCreatePage";
export default PermissionGroupCreatePage;
