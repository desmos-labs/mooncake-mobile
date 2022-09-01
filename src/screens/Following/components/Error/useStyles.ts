import {makeStyle} from 'config/theme';

const useStyles = makeStyle(() => ({
  wrapper: {
    top: 0,
    bottom: 'auto',
    flexBasis: 'auto',
    flexGrow: 0,
    flexShrink: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
    margin: 0,
    padding: 0,
  },
  errorContainer: {
    margin: 12,
    borderColor: 'rgb(248,170,212)',
    borderWidth: 1,
    backgroundColor: 'rgb(255,238,248)',
    borderRadius: 8,
    padding: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexBasis: 'auto',
    flexGrow: 0,
    flexShrink: 1,
    height: 'auto',
  },
  errorMessage: {
    flexGrow: 0,
    flexShrink: 1,
    flexBasis: 'auto',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  errorTitle: {
    /* Subtitle/Subtitle 3・14・Semibold｜Auto */
    fontStyle: 'normal',
    fontWeight: '600',
    fontSize: 14,
    lineHeight: 21,
    /* identical to box height */

    alignItems: 'center',
    letterSpacing: 0.0125,

    /* Neutral Color/Dark Grey */
    color: '#34383E',
    width: '100%',
  },
  errorText: {
    /* Body/Body 7・12・Regular｜16 */
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 12,
    lineHeight: 16,
    /* identical to box height, or 133% */

    alignItems: 'center',

    /* Neutral Color/Dark Grey */
    color: '#34383E',
    width: '100%',
  },
  retryLabel: {
    /* Subtitle/Subtitle 3・14・Semibold｜Auto */
    fontStyle: 'normal',
    fontWeight: '600',
    fontSize: 14,
    lineHeight: 21,
    /* identical to box height */

    alignItems: 'center',
    letterSpacing: 0.0125,

    /* Neutral Color/Dark Grey */
    color: '#34383E',
  },
  retryContent: {
    padding: 3,
    flexGrow: 0,
    flexShrink: 1,
    flexBasis: 'auto',
  },
}));

export default useStyles;
