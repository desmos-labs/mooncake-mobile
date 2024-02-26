import { makeStyle } from 'config/theme';

const useStyles = makeStyle(theme => ({
  container: {
    flex: 1,
    paddingHorizontal: theme.spacings.m,
  },
  flexCenter: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: theme.spacings.xl,
  },
  address: {
    maxWidth: 170,
    backgroundColor: theme.colors.primaryVariants['100'],
    padding: theme.spacings.s,
    borderRadius: 8,
  },
  addressView: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: theme.spacings.m,
    paddingHorizontal: 66,
    gap: 4,
  },
  button: {
    padding: theme.spacings.s,
    backgroundColor: theme.colors.primaryVariants['100'],
    borderRadius: 8,
  },
  roundedButton: {
    padding: theme.spacings.s,
    backgroundColor: theme.colors.primaryVariants['100'],
    borderRadius: 20,
  },
  titleView: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  balanceView: {
    marginTop: theme.spacings.m,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    backgroundColor: 'transparent',
  },
  sectionHeader: {
    flex: 1,
    paddingTop: theme.spacings.m,
    paddingBottom: theme.spacings.s,
    backgroundColor: theme.colors.white,
  },
  emptyIcon: {
    width: 72,
    height: 72,
    marginBottom: theme.spacings.s,
  },
  emptyView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  balanceSubtitle: {
    color: theme.colors.neutralVariants['700'],
    paddingBottom: theme.spacings.s,
  },
  subtitle: {
    paddingBottom: theme.spacings.s,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.neutralVariants['200'],
    paddingHorizontal: -200,
  },
  paddingHorizontalM: {
    paddingHorizontal: theme.spacings.m,
  },
  centerElement: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  gradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 380,
  },
  icon: {
    height: 20,
    width: 20,
  },
  roundedIcon: {
    height: 20,
    width: 20,
  },
}));

export default useStyles;
