import { PermissionEnum, useAuthStore } from "@/store";
import AccessDeniedPage from "./AccessDeniedPage";

const AccessControl = ({
	permissions,
	children,
}: {
	permissions: PermissionEnum[];
	children: React.ReactNode;
}) => {
	const { permissions: userPermissions } = useAuthStore();

	console.table({
		permissions,
		userPermissions,
		includesAll: permissions.includes(PermissionEnum.ALL),
		somePermission: permissions.some((permission) =>
			userPermissions.includes(permission)
		),
	});
	if (
		userPermissions.includes(PermissionEnum.ALL) ||
		permissions.some((permission) => userPermissions.includes(permission))
	) {
		return children;
	}

	return <AccessDeniedPage />;
};

export default AccessControl;
