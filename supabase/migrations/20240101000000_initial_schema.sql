-- Create users table
create table public.users (
  id uuid references auth.users on delete cascade not null primary key,
  email text not null,
  role text not null check (role in ('admin', 'user')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create venues table
create table public.venues (
  id uuid default uuid_generate_v4() primary key,
  owner_user_id uuid references public.users on delete cascade not null,
  name text not null,
  address text not null,
  capacity integer not null,
  image_url text,
  price integer not null default 1000,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create bookings table
create table public.bookings (
  id uuid default uuid_generate_v4() primary key,
  venue_id uuid references public.venues on delete cascade not null,
  user_id uuid references public.users on delete cascade not null,
  date timestamp with time zone not null,
  status text not null check (status in ('pending', 'confirmed', 'cancelled')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Set up Row Level Security (RLS)
alter table public.users enable row level security;
alter table public.venues enable row level security;
alter table public.bookings enable row level security;

-- Create policies
create policy "Users can view their own data"
  on public.users for select
  using (auth.uid() = id);

create policy "Admins can view all venues"
  on public.venues for select
  using (
    exists (
      select 1 from public.users
      where users.id = auth.uid()
      and users.role = 'admin'
    )
  );

create policy "Users can view all venues"
  on public.venues for select
  using (true);

create policy "Admins can create venues"
  on public.venues for insert
  with check (
    exists (
      select 1 from public.users
      where users.id = auth.uid()
      and users.role = 'admin'
    )
  );

create policy "Users can view their own venues"
  on public.venues for select
  using (owner_user_id = auth.uid());

create policy "Users can update their own venues"
  on public.venues for update
  using (owner_user_id = auth.uid());

create policy "Users can delete their own venues"
  on public.venues for delete
  using (owner_user_id = auth.uid());

create policy "Users can view their own bookings"
  on public.bookings for select
  using (user_id = auth.uid());

create policy "Users can create bookings"
  on public.bookings for insert
  with check (user_id = auth.uid());

create policy "Users can update their own bookings"
  on public.bookings for update
  using (user_id = auth.uid());

create policy "Users can delete their own bookings"
  on public.bookings for delete
  using (user_id = auth.uid());

-- Create function to handle new user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, email, role)
  values (new.id, new.email, 'user');
  return new;
end;
$$ language plpgsql security definer;

-- Create trigger for new user signup
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

UPDATE public.users
SET role = 'admin'
WHERE email = 'roman.sk8@bk.ru';

alter table public.venues add column price integer not null default 1000; 