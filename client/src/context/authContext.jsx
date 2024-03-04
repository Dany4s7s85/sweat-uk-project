import { useState, useMemo, createContext } from 'react';

const context = {};

export const AuthContext = createContext(context);

export function AuthContextProvider(props) {
    const [isStudent, setIsStudent] = useState('Student')
    const [pdfPreviewData, setPdfPreviewData] = useState({})
    const [graphSS, setGraphSS] = useState();
    const [filtersData, setFiltersData] = useState();
    const [refetch, setRefetch] = useState(0);

    const allContext = useMemo(
        () => ({
            setIsStudent,
            setPdfPreviewData,
            setFiltersData,
            setRefetch,
            setGraphSS,
            pdfPreviewData,
            filtersData,
            isStudent,
            refetch,
            graphSS,
        }),
        [isStudent, filtersData, refetch, pdfPreviewData, graphSS],
    );
    return <AuthContext.Provider value={allContext}>{props.children}</AuthContext.Provider>;
}
