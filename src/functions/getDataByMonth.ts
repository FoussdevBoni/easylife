type DataItem = {
    date: string; // Date sous forme de chaîne ISO ex: "2024-02-10T12:34:56.789Z"
    [key: string]: any;
};

export function getDataByMonth(data: any, month?: number): [] {
    const currentYear = new Date().getFullYear()

    return data.filter((item: any) => {
        const itemDate = new Date(item.date); 
        const itemYear =  itemDate.getFullYear()
        const itemMonth = itemDate.getMonth() ; 
        return (itemMonth === month && itemYear===currentYear);
    });
}
