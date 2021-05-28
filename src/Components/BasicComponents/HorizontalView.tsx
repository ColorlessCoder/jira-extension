import { createStyles, makeStyles, Theme } from "@material-ui/core"
import { useEffect, useRef } from "react";

const useStyles = makeStyles((theme: Theme) => createStyles({
    horizontal: {
        overflowX: "auto",
        maxWidth: "100%",
        whiteSpace: "nowrap",
        touchAction: "none",
        paddingBottom: 5,
        "&::-webkit-scrollbar-track": {
            visibility: "hidden"
        },
        "&::-webkit-scrollbar-thumb": {
            visibility: "hidden"
        },
        "&::-webkit-scrollbar-thumb:hover": {
            visibility: "hidden"
        },
        "&:hover": {
            "&::-webkit-scrollbar-track": {
                visibility: "visible"
            },
            "&::-webkit-scrollbar-thumb": {
                visibility: "visible"
            },
            "&::-webkit-scrollbar-thumb:hover": {
                visibility: "visible"
            },
        }
    }
}))

export default function HorizontalView({children}: {children: any}) {
    const classes = useStyles();
    const ref = useRef<any>(null)
    useEffect(() => {
        if(ref.current){
            ref.current.addEventListener("wheel", (e: any) => {
                if (e.deltaY == 0) return;
                e.preventDefault();
                ref.current.scrollTo({
                    left: ref.current.scrollLeft + (e.deltaY * 2),
                    behavior: "smooth"
                });
            }, false)
        }
        return () => {
            if(ref.current) {
                ref.current.addEventListener("wheel", (e:any) => e.stopImmediatePropagation(), true)
            }
        }
    }, [ref])
    return <div className={classes.horizontal} ref={ref}>
        {children}
    </div>
}