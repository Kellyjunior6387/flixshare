FROM ubuntu:22.04

# Prevent tzdata from asking for user input
ENV DEBIAN_FRONTEND=noninteractive


# Install Python and dependencies
RUN apt-get update && apt-get install -y \
    python3 python3-pip python3-venv python3-dev \
    curl gnupg2 unixodbc-dev \
    tzdata \
    && rm -rf /var/lib/apt/lists/*

# Set timezone
ENV TZ=UTC
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

# Install Microsoft ODBC Driver for SQL Server
RUN curl -sSL -O https://packages.microsoft.com/config/ubuntu/22.04/packages-microsoft-prod.deb \
    && dpkg -i packages-microsoft-prod.deb \
    && rm packages-microsoft-prod.deb \
    && apt-get update \
    && ACCEPT_EULA=Y apt-get install -y  mssql-tools18 \
    && echo 'export PATH="$PATH:/opt/mssql-tools18/bin"' >> ~/.bashrc

#Working directory
WORKDIR /app

#Copy requirements first
COPY requirements.txt /app/

# Install Python dependencies
RUN pip3 install --no-cache-dir -r requirements.txt

#Copy project code into container
COPY . /app/

#Expose the port it will run on
EXPOSE 8000

# 9. Command to run the server
CMD ["python3", "manage.py", "runserver", "0.0.0.0:8000"]