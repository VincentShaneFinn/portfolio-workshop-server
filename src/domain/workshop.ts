export function addOne(val: number | string) {
    if(typeof(val) == "string") return val + "one";
    return val + 1;
}