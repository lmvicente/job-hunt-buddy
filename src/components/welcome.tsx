
type Props = { firstName: string };


export default function Welcome({ firstName }: Props) {
    return (
        <p className="hidden text-[13px] text-muted-foreground sm:block">
            Welcome, <span className="font-medium text-foreground">{firstName}</span>
        </p>
    )
}
