
type Props = { firstName: string };


export default function Welcome({ firstName }: Props) {
    return (
        <p className="hidden text-sm text-muted-foreground sm:block">
            Welcome, <span className="font-medium text-foreground">{firstName}</span>
        </p>
    )
}
