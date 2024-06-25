import { StyleSheet } from "react-native";

export const flex1 = {
    flex: 1
};

export const flex2 = {
    flex: 2
};

export const flex5 = {
    flex: 5
};

export const flexColumn = {
    flexDirection: 'column',
};

export const column1 = {
    ...flex1,
    ...flexColumn
};

export const flexRow = {
    flexDirection: 'row',
};

export const center = {
    alignItems: 'center',
    justifyContent: 'center'
};

export const xsmMargin = StyleSheet.create({
    bottom: { marginBottom: 12 },
    horizontal: { marginHorizontal: 12 },
    left: { marginLeft: 12 },
    margin: { margin: 12 },
    right: { marginRight: 12 },
    top: { marginTop: 12 },
    vertical: { marginVertical: 12 },
});

export const smMargin = StyleSheet.create({
    bottom: { marginBottom: 14 },
    horizontal: { marginHorizontal: 14 },
    left: { marginLeft: 14 },
    margin: { margin: 14 },
    right: { marginRight: 14 },
    top: { marginTop: 14 },
    vertical: { marginVertical: 14 },
});

export const mdMargin = StyleSheet.create({
    bottom: { marginBottom: 16 },
    horizontal: { marginHorizontal: 16 },
    left: { marginLeft: 16 },
    margin: { margin: 16 },
    right: { marginRight: 16 },
    top: { marginTop: 16 },
    vertical: { marginVertical: 16 },
});

export const lgMargin = StyleSheet.create({
    bottom: { marginBottom: 20 },
    horizontal: { marginHorizontal: 20 },
    left: { marginLeft: 20 },
    margin: { margin: 20 },
    right: { marginRight: 20 },
    top: { marginTop: 20 },
    vertical: { marginVertical: 20 },
});

export const xlgMargin = StyleSheet.create({
    bottom: { marginBottom: 25 },
    horizontal: { marginHorizontal: 25 },
    left: { marginLeft: 25 },
    margin: { margin: 25 },
    right: { marginRight: 25 },
    top: { marginTop: 25 },
    vertical: { marginVertical: 25 },
});

export const xsmPadding = StyleSheet.create({
    bottom: { paddingBottom: 12 },
    horizontal: { paddingHorizontal: 12 },
    left: { paddingLeft: 12 },
    padding: { padding: 12 },
    right: { paddingRight: 12 },
    top: { paddingTop: 12 },
    vertical: { paddingVertical: 12 },
});

export const smPadding = StyleSheet.create({
    bottom: { paddingBottom: 14 },
    horizontal: { paddingHorizontal: 14 },
    left: { paddingLeft: 14 },
    padding: { padding: 14 },
    right: { paddingRight: 14 },
    top: { paddingTop: 14 },
    vertical: { paddingVertical: 14 },
});

export const mdPadding = StyleSheet.create({
    bottom: { paddingBottom: 16 },
    horizontal: { paddingHorizontal: 16 },
    left: { paddingLeft: 16 },
    padding: { padding: 16 },
    right: { paddingRight: 16 },
    top: { paddingTop: 16 },
    vertical: { paddingVertical: 16 },
});

export const lgPadding = StyleSheet.create({
    bottom: { paddingBottom: 20 },
    horizontal: { paddingHorizontal: 20 },
    left: { paddingLeft: 20 },
    padding: { padding: 20 },
    right: { paddingRight: 20 },
    top: { paddingTop: 20 },
    vertical: { paddingVertical: 20 },
});

export const hide = {
    display: 'none'
};